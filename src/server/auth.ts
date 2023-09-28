import axios from "axios";
import type { NextFunction, Response, Request } from "express";
import type { Socket } from "socket.io";
import { config } from "../../config";
import { logger } from "./utils";

const keyCache: Record<string, true> = {};

function validateToken(token?: string) {
  if (!token) {
    return Promise.reject();
  }

  if (keyCache[token]) {
    return Promise.resolve();
  }

  return axios
    .get(config.home_assistant.url, {
      headers: { authorization: token },
    })
    .then((res) => {
      if (res.status === 200) {
        keyCache[token] = true;
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    });
}

export function expressAuth() {
  return function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    validateToken(token).then(
      () => next(),
      () => res.sendStatus(401)
    );
  };
}

export function ioAuth() {
  return function middleware(socket: Socket, next: (err?: Error) => void) {
    const token = socket.handshake.auth.token;
    logger.info("validating socket connection");

    validateToken(token).then(
      () => next(),
      () => {
        const err = new Error("not authorized");
        next(err);
      }
    );
  };
}
