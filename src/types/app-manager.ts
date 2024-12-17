export type UpdateStatus =
  | "updated"
  | "update-available"
  | "locked"
  | "local"
  | "unknown";

export interface App {
  id: string;
  name: string;
  status: AppStatus | null;
  cpu: number | null;
  memory: string | null;
  uptime: string | null;
  type: "docker" | "pm2";
}

export type AppStatus = "running" | "stopped" | "errored";

export type PM2Status =
  | "online"
  | "stopping"
  | "stopped"
  | "launching"
  | "errored"
  | "one-launch-status";

export type DockerStatus =
  | "created"
  | "restarting"
  | "running"
  | "removing"
  | "paused"
  | "exited"
  | "dead";
