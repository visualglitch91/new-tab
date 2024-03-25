import http from "http";
import express from "express";
import ViteExpress from "vite-express";
import session from "express-session";
import cors from "cors";
import config from "./config";
import { pinoHttp } from "./utils";
import { expressAuth } from "./auth";
import io from "./io";

const port = config.port;
const app = express();
const server = http.createServer(app);

const sessionMiddleware = session({
  secret: String(Date.now()),
  resave: true,
  saveUninitialized: true,
});

app.use(cors());
app.use(sessionMiddleware);
app.use(pinoHttp);
app.use(io(server, sessionMiddleware));
app.use("/api", expressAuth());

app.use(express.json());

//@ts-expect-error
const modules = import.meta.glob("./modules/*/index.ts", { eager: true });

for (const key in modules) {
  //@ts-ignore
  const { default: mod } = modules[key];
  app.use(`/api/${mod.name}`, await mod.setup());
  console.log(`module loaded: ${mod.name}`);
}

ViteExpress.config({
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
});

ViteExpress.bind(app, server);

server.listen({ host: "0.0.0.0", port }, () => {
  console.log(`Server listening at ${port}`);
});

const shutdown = () => process.exit();

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
