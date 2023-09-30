import pm2 from "pm2";
import { App, AppStatus, PM2Status } from "@home-control/types/app-manager";
import {
  isDefined,
  timeSince,
  bytesToSize,
  createProccessOutputStreamer,
} from "../../utils";

const statusMap: Record<PM2Status, AppStatus> = {
  online: "running",
  stopping: "running",
  stopped: "stoppped",
  launching: "running",
  errored: "errored",
  "one-launch-status": "stoppped",
};

function translateStatus(status?: PM2Status) {
  if (!status) {
    return null;
  }

  return statusMap[status];
}

export function list() {
  return new Promise<App[]>((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        reject(err);
      }

      pm2.list((err, apps) => {
        pm2.disconnect();
        if (err) {
          reject(err);
        }

        resolve(
          apps.map((app) => ({
            id: app.pm_id!.toString(),
            name: app.name || app.pm_id!.toString(),
            status: translateStatus(app.pm2_env?.status),
            cpu: isDefined(app.monit?.cpu) ? app.monit!.cpu! : 0,
            memory: isDefined(app.monit?.memory)
              ? bytesToSize(app.monit!.memory!)
              : "0mb",
            uptime: app.pm2_env?.pm_uptime
              ? timeSince(app.pm2_env.pm_uptime)
              : null,
            type: "pm2",
            updateAvailable: false,
          }))
        );
      });
    });
  });
}

export function getAppByName(name: string) {
  const app = list().then((apps) => apps.find((it) => it.name === name));

  if (!app) {
    throw new Error("App not found");
  }

  return app;
}

export function action(name: string, action: "start" | "stop" | "restart") {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        reject(err);
      }

      pm2[action === "stop" ? "stop" : "restart"](name, (err, proc) => {
        pm2.disconnect();

        if (err) {
          reject(err);
        }

        resolve(proc);
      });
    });
  });
}

export async function createLogStreamer(name: string) {
  await getAppByName(name);

  return createProccessOutputStreamer("pm2", [
    "logs",
    name,
    "--raw",
    "--lines",
    "100",
  ]);
}
