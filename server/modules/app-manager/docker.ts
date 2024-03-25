import PQueue from "p-queue";
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
import fetchImageUpdateStatus from "./fetchImageUpdateStatus";
import dockerode from "./dockerode";

const queue = new PQueue({ concurrency: 4 });
const dockerImageUpdatesByName: Record<string, UpdateStatus> = {};

export async function checkForContainerImageUpdates(container: string) {
  const status = await fetchImageUpdateStatus(container);
  dockerImageUpdatesByName[container] = status;
  return status;
}

export function setupUpdateChecker() {
  logger.info("Setup Docker Update Checker");

  const check = async () => {
    logger.info("Checking docker image updates");

    // Fetch list of containers
    const containers = await dockerode.listContainers({ all: true });

    // Array to store results
    const results: {
      container: string;
      status: UpdateStatus;
    }[] = [];

    const tasks = containers.map((containerInfo) => async () => {
      const container = containerInfo.Names[0].substring(1);
      const status = await fetchImageUpdateStatus(container);
      results.push({ status, container });
    });

    await queue.addAll(tasks);

    results.forEach((it) => {
      dockerImageUpdatesByName[it.container] = it.status;
    });
  };

  check();
  setInterval(check, 10 * 60_0000);
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
    .map((container: any) => {
      const name = getName(container);

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
        updateStatus: dockerImageUpdatesByName[name],
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
  action: "start" | "stop" | "restart"
) {
  const container = await dockerode.getContainer(name);
  //@ts-expect-error
  await container[action]();
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
