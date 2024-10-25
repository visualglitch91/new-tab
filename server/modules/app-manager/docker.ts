import ky from "ky";
import { CronJob } from "cron";
//@ts-expect-error
import parseDockerImageName from "parse-docker-image-name";
import {
  App,
  AppStatus,
  DockerStatus,
  UpdateStatus,
} from "$common/types/app-manager";
import {
  isDefined,
  bytesToSize,
  createProccessOutputStreamer,
  logger,
} from "$server/utils";
import config from "$server/config";
import dockerode from "./dockerode";

let updateMap: Record<string, boolean | undefined> = {};

const cup = ky.create({
  prefixUrl: config.app_manager.docker_cup_host,
});

export function refreshUpdateStatus() {
  return cup.get("refresh").then(() => ({ ok: true }));
}

export async function fetchUpdateStatuses() {
  try {
    logger.info("Checking docker image updates");

    const data = await cup
      .get("json")
      .then((res) => res.json<{ images: Record<string, boolean> }>())
      .then((res) => res.images);

    updateMap = data;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

export function setupUpdateChecker() {
  logger.info("Setup Docker Update Checker");
  fetchUpdateStatuses();
  new CronJob("0 * * * *", fetchUpdateStatuses).start();
}

const statusMap: Record<DockerStatus, AppStatus> = {
  created: "stoppped",
  restarting: "stoppped",
  running: "running",
  removing: "stoppped",
  paused: "stoppped",
  exited: "stoppped",
  dead: "errored",
};

function translateStatus(status: DockerStatus) {
  return statusMap[status];
}

async function getStats(name: string) {
  const container = await dockerode.getContainer(name);
  return container.stats({ stream: false });
}

function getName(container: any) {
  return container.Names[0].substr(1);
}

function calculateCPUPercentUnix(cpuStats: any, precpuStats: any) {
  const cpuDelta =
    cpuStats.cpu_usage.total_usage - precpuStats.cpu_usage.total_usage;

  const systemCPUDelta =
    cpuStats.system_cpu_usage - precpuStats.system_cpu_usage;

  const numberCPUs = cpuStats.online_cpus;

  return (cpuDelta / systemCPUDelta) * numberCPUs * 100.0;
}

export async function getContainers(name?: string): Promise<App[]> {
  const promises = (await dockerode.listContainers({ all: true }))
    .filter((it: any) => (name ? getName(it) === name : true))
    .map(async (container: any) => {
      const name = getName(container);
      let updateStatus: UpdateStatus = "unknown";

      try {
        const container = dockerode.getContainer(name);
        const containerInspectInfo = await container.inspect();
        const image = containerInspectInfo.Config.Image;
        const tag = parseDockerImageName(image).tag;

        if (tag && tag !== "latest") {
          updateStatus = "locked";
        } else {
          updateStatus = updateMap[tag ? image : `${image}:latest`]
            ? "update-available"
            : "updated";
        }
      } catch (err) {
        console.error({ name, err });
      }

      return getStats(name).then((stats) => ({
        id: container.Id as string,
        name,
        type: "docker" as const,
        status: translateStatus(container.State),
        memory: isDefined(stats.memory_stats.usage)
          ? bytesToSize(stats.memory_stats.usage)
          : "0mb",
        cpu: calculateCPUPercentUnix(stats.cpu_stats, stats.precpu_stats) || 0,
        uptime: container.Status,
        updateStatus,
      }));
    });

  return Promise.all(promises);
}

export async function getContainerByName(name: string) {
  const containers = await getContainers(name);

  if (!containers[0]) {
    throw new Error("Container not found");
  }

  return containers[0];
}

export async function action(
  name: string,
  action: "start" | "stop" | "restart",
  options?: any
) {
  const container = await dockerode.getContainer(name);
  await container[action](options);
}

export async function createLogStreamer(name: string) {
  await getContainerByName(name);

  return createProccessOutputStreamer("docker", [
    "container",
    "logs",
    name,
    "-f",
    "--tail",
    "100",
  ]);
}
