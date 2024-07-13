import ky from "ky";
import config from "$server/config";
import { logger } from "$server/utils";

function base64(value: string) {
  return Buffer.from(value).toString("base64");
}

function fetchImageDigestFromRegistryAPI({
  baseUrl,
  token,
  path,
  tag,
  architecture,
  os,
}: {
  baseUrl: string;
  token: string;
  path: string;
  tag: string;
  architecture: string;
  os: string;
}) {
  const url = `${baseUrl}/${path}/manifests/${tag}`;

  return ky
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:
          "application/vnd.docker.distribution.manifest.list.v2+json,application/vnd.oci.image.index.v1+json",
      },
    })
    .json<{ manifests: any[] }>()
    .then(
      (res) => {
        return (
          res.manifests.find(
            (it) =>
              it.platform.architecture === architecture && it.platform.os === os
          )?.digest || null
        );
      },
      (error) => {
        logger.error(
          { url, token, error },
          "Error when fetching image manifest"
        );
        return null;
      }
    );
}

async function fetchImageDigestFromDockerRegistry(
  path: string,
  tag: string,
  architecture: string,
  os: string
) {
  const baseUrl = "https://registry-1.docker.io/v2";
  const tokenUrl = `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${path}:pull`;
  const { token } = await ky.get(tokenUrl).json<{ token: string }>();

  return fetchImageDigestFromRegistryAPI({
    baseUrl,
    token,
    path,
    tag,
    architecture,
    os,
  });
}

function fetchImageDigestFromGitHubRegistry(
  registry: string,
  path: string,
  tag: string,
  architecture: string,
  os: string,
  registryConfig: { token: string; registry_url?: string }
) {
  const { registry_url, token } = registryConfig;

  return fetchImageDigestFromRegistryAPI({
    baseUrl: registry_url ? `${registry_url}/v2` : `https://${registry}/v2`,
    token: base64(token),
    path,
    tag,
    architecture,
    os,
  });
}

async function fetchImageDigestFromGitLabRegistry(
  registry: string,
  path: string,
  tag: string,
  architecture: string,
  os: string,
  registryConfig: { auth_url: string; token: string }
) {
  const tokenUrl = `${registryConfig.auth_url}/jwt/auth?service=container_registry&scope=repository:${path}:pull`;
  const { token } = await ky
    .get(tokenUrl, {
      headers: { Authorization: `Basic ${base64(`:${registryConfig.token}`)}` },
    })
    .json<{ token: string }>();

  return fetchImageDigestFromRegistryAPI({
    baseUrl: `https://${registry}/v2`,
    token: token,
    path,
    tag,
    architecture,
    os,
  });
}

const fetchPerType = {
  github: fetchImageDigestFromGitHubRegistry,
  gitlab: fetchImageDigestFromGitLabRegistry,
};

export default function fetchImageDigest(
  registry: string,
  path: string,
  tag: string,
  architecture: string,
  os: string
) {
  if (registry === "docker") {
    return fetchImageDigestFromDockerRegistry(
      `library/${path}`,
      tag,
      architecture,
      os
    );
  }

  //@ts-expect-error
  const registryConfig = config.app_manager.custom_registries[registry];

  if (!registryConfig) {
    logger.error({ registry }, "Custom registry config not found");
  }

  const { type } = registryConfig;

  const func =
    //@ts-expect-error
    fetchPerType[type];

  if (!func) {
    logger.error({ type }, "Registry type not supported");
  }

  if (!registryConfig || !func) {
    return Promise.resolve(null);
  }

  return func(registry, path, tag, architecture, os, registryConfig);
}
