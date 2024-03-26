import { UpdateStatus } from "$common/types/app-manager";
import { logger } from "$server/utils";
import fetchImageDigest from "./fetchImagDigest";
import dockerode from "./dockerode";

function parseImageName(imageName: string) {
  const [rest, tag = "latest"] = imageName.split(":");
  const [name, namespace = "library", registry = "docker"] = rest
    .split("/")
    .reverse();

  return { raw: imageName, tag, name, namespace, registry };
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
      localImageDigest = await fetchImageDigest(
        image.registry,
        image.namespace,
        image.name,
        localRepoDigest,
        localImageInfo.Architecture,
        localImageInfo.Os
      ).catch(() => null);
    } else {
      local = true;
    }

    if (localImageDigest) {
      remoteImageDigest = await fetchImageDigest(
        image.registry,
        image.namespace,
        image.name,
        "latest",
        localImageInfo.Architecture,
        localImageInfo.Os
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
