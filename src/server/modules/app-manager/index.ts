import * as pm2 from "./pm2";
import * as docker from "./docker";
import { createAppModule, compareByName } from "../../helpers";

const appModule = createAppModule("app-manager");

appModule.get("/apps", async () => {
  const containers = await docker.getContainers();
  const apps = await pm2.list();
  return { apps: [...containers, ...apps].sort(compareByName) };
});

/*
 * Docker Apps
 */

appModule.get<{ Params: { name: string } }>("/docker/:name", (req) => {
  const { name } = req.params;
  return docker.getContainerByName(name);
});

appModule.post<{ Params: { name: string }; Body: { running: boolean } }>(
  "/docker/:name",
  async (req) => {
    const { name } = req.params;
    return docker.action(name, req.body.running ? "start" : "stop");
  }
);

appModule.post<{
  Params: {
    name: string;
    action: "start" | "stop" | "restart";
  };
}>("/docker/:name/:action", async (req) => {
  const { name, action } = req.params;
  appModule.log(`POST /docker/${name}/${action}`);
  return docker.action(name, action);
});

/*
 * PM2 Apps
 */

appModule.get<{ Params: { name: string } }>("/pm2/:name", (req) => {
  const { name } = req.params;
  return pm2.getAppByName(name);
});

appModule.post<{ Params: { name: string }; Body: { running: boolean } }>(
  "/pm2/:name",
  async (req) => {
    const { name } = req.params;
    return pm2.action(name, req.body.running ? "start" : "stop");
  }
);

appModule.post<{
  Params: { name: string; action: "start" | "stop" | "restart" };
}>("/pm2/:name/:action", async (req) => {
  const { name, action } = req.params;
  appModule.log(`POST /pm2/${name}/${action}`);
  return pm2.action(name, action);
});

export default appModule;
