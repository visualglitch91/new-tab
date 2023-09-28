import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { Server as IOServer } from "socket.io";
import session from "express-session";
import { config } from "../../config";
import { pinoHttp, logger } from "./utils";
import { expressAuth, ioAuth } from "./auth";

const isDev = process.env.NODE_ENV === "dev";
const app = express();
const host = "0.0.0.0";
const port = isDev ? config.development_server_port : config.port;

const sessionMiddleware = session({
  secret: String(Date.now()),
  resave: true,
  saveUninitialized: true,
});

app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(pinoHttp);
app.use("/api", expressAuth());

const server = app.listen({ host, port }, () => {
  logger.warn(`Server listening at ${host}:${port}`);
});

const io = new IOServer(server, { path: "/socket" });

app.use((req, _, next) => {
  logger.warn(`attaching io to request`);
  req.io = io;
  next();
});

io.use(ioAuth());
io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
  const sessionId = socket.request.session.id;
  socket.join(sessionId);
  logger.warn(`socket ${socket.id} connected at session ${sessionId}`);
});

if (!isDev) {
  app.use(express.static(path.resolve(__dirname + "/../../dist")));
}

//@ts-expect-error
const modules = import.meta.glob("./modules/*/index.ts", { eager: true });

for (let key in modules) {
  //@ts-ignore
  const { default: mod } = modules[key];
  app.use(`/api/${mod.name}`, mod.middleware);
  logger.warn(`module loaded: ${mod.name}`);
}

declare module "http" {
  interface IncomingMessage {
    io: IOServer;
    session: { id: string };
  }
}
