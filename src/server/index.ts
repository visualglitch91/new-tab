import path from "path";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { config } from "../../config";
import { pinoHttp } from "./utils";
import { expressAuth } from "./auth";
import io from "./io";

const isDev = process.env.NODE_ENV === "development";
const host = "0.0.0.0";
const port = isDev ? config.development_server_port : config.port;

console.log({ isDev, port });

const app = express();
const server = http.createServer(app);

const sessionMiddleware = session({
  secret: String(Date.now()),
  resave: true,
  saveUninitialized: true,
});

app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(pinoHttp);
app.use("/api", expressAuth());
app.use(io(server, sessionMiddleware));

if (!isDev) {
  app.use(express.static(path.resolve(__dirname + "/../../dist")));
}

//@ts-expect-error
const modules = import.meta.glob("./modules/*/index.ts", { eager: true });

for (let key in modules) {
  //@ts-ignore
  const { default: mod } = modules[key];
  app.use(`/api/${mod.name}`, await mod.setup());
  console.log(`module loaded: ${mod.name}`);
}

server.listen({ host, port }, () => {
  console.log(`Server listening at ${host}:${port}`);
});
