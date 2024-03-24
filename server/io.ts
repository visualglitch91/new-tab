import { Server as SocketIO } from "socket.io";
import { Handler } from "express";
import { Server } from "http";
import { ioAuth } from "./auth";
import { logger } from "./utils";

export default function io(
  server: Server,
  sessionMiddleware: Handler
): Handler {
  const ioServer = new SocketIO(server, { path: "/socket" });

  ioServer.use(ioAuth());
  ioServer.engine.use(sessionMiddleware);

  ioServer.on("connection", (socket) => {
    const sessionId = socket.request.session.id;
    socket.join(sessionId);
    logger.info(`socket ${socket.id} connected at session ${sessionId}`);
  });

  return (req, _, next) => {
    req.io = ioServer;
    next();
  };
}

declare module "http" {
  interface IncomingMessage {
    io: SocketIO;
    session: { id: string };
  }
}
