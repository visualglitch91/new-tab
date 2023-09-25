export interface App {
  id: string;
  name: string;
  status: "running" | "stoppped" | "errored";
  cpu: number;
  memory: string;
  uptime: string;
  type: "docker" | "pm2";
}
