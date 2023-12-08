import axios from "axios";
import Docker from "dockerode";
import { App, AppStatus, DockerStatus } from "@home-control/types/app-manager";
import { config } from "../../../../../config";
import {
  bytesToSize,
  createProccessOutputStreamer,
  isDefined,
  Logger,
} from "../../utils";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

const statusMap: Record<DockerStatus, AppStatus> = {
  created: "stoppped",
  restarting: "stoppped",
  running: "running",
  removing: "stoppped",
  paused: "stoppped",
  exited: "stoppped",
  dead: "errored",
};

const updatesAvailableByName: Record<string, boolean | undefined> = {};

export function setupUpdateChecker(logger: Logger) {
  function checkForUpdates() {
    axios
      .get<{ name: string; updateAvailable: boolean }[]>(
        `${config.whats_up_docker.url}/api/containers`
      )
      .then(
        (res) =>
          res.data.forEach((it) => {
            if (it.updateAvailable) {
              updatesAvailableByName[it.name] = true;
            } else {
              delete updatesAvailableByName[it.name];
            }
          }),
        (err) => logger
      );
  }

  checkForUpdates();
  setInterval(checkForUpdates, 10 * 60_0000);
}

function translateStatus(status: DockerStatus) {
  return statusMap[status];
}

async function getStats(name: string) {
  const container = await docker.getContainer(name);
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
  const promises = (await docker.listContainers({ all: true }))
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
        updateAvailable: !!updatesAvailableByName[name],
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
  const container = await docker.getContainer(name);
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
