import pRetry from "p-retry";
//@ts-expect-error
import parseDockerImageName from "parse-docker-image-name";
import { UpdateStatus } from "$common/types/app-manager";
import { logger } from "$server/utils";
import fetchImageDigest from "./fetchImageDigest";
import dockerode from "./dockerode";

function parseImageName(imageName: string) {
  const {
    path,
    domain: registry = "docker",
    tag = "latest",
  } = parseDockerImageName(imageName);

  return { raw: imageName, tag, path, registry };
}

export default async function fetchImageUpdateStatus(containerName: string) {
  const container = dockerode.getContainer(containerName);

  // Inspect the container
  const containerInspectInfo = await container.inspect();

  // Get the image ID of the container
  const image = parseImageName(containerInspectInfo.Config.Image);
  const locked = image.tag && image.tag !== "latest";

  let localImageDigest: string | null = null;
  let remoteImageDigest: string | null = null;
  let local = false;

  logger.info({ containerName }, "Checking for image updates");

  if (!locked) {
    // Get the image info
    const localImageInfo = await dockerode.getImage(image.raw).inspect();

    // Get the image name and tag
    const localRepoDigest =
      localImageInfo.RepoDigests[0]?.split("@").pop() || null;

    if (localRepoDigest) {
      localImageDigest = await pRetry(
        () =>
          fetchImageDigest(
            image.registry,
            image.path,
            localRepoDigest,
            localImageInfo.Architecture,
            localImageInfo.Os
          ),
        { retries: 5, minTimeout: 1000 }
      ).catch(() => null);
    } else {
      local = true;
    }

    if (localImageDigest) {
      remoteImageDigest = await pRetry(
        () =>
          fetchImageDigest(
            image.registry,
            image.path,
            "latest",
            localImageInfo.Architecture,
            localImageInfo.Os
          ),
        { retries: 5, minTimeout: 1000 }
      ).catch(() => null);
    }
  }

  const status = (
    locked
      ? "locked"
      : local
      ? "local"
      : localImageDigest === null || remoteImageDigest === null
      ? "unknown"
      : localImageDigest === remoteImageDigest
      ? "updated"
      : "update-available"
  ) as UpdateStatus;

  logger.info({ container: containerName, status }, "Updated status fetched");

  return status;
}
