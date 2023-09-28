import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { config } from "../../config";
import { pinoHttp,logger } from "./utils";
import { auth } from "./auth";

const isDev = process.env.NODE_ENV === "dev";
const app = express();
const host = "0.0.0.0";
const port = isDev ? config.development_server_port : config.port;

app.use(bodyParser.json());

app.use(pinoHttp);

app.use("/api", auth());

if (!isDev) {
  app.use(express.static(path.resolve(__dirname + "/../../dist")));
}

//@ts-expect-error
const modules = import.meta.glob("./modules/*/index.ts", { eager: true });

for (let key in modules) {
  //@ts-ignore
  const { default: mod } = modules[key];
  app.use(`/api/${mod.name}`, mod.middleware);
  logger.info(`module loaded: ${mod.name}`);
}

app.listen({ host, port }, () => {
  logger.info(`Server listening at ${host}:${port}`);
});
