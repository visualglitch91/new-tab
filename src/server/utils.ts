import ObjectID from "bson-objectid";
import { spawn } from "child_process";
import { Request, Response, Router } from "express";
import pino, { HttpLogger } from "pino-http";
import { Socket } from "socket.io";

export function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function withRetry<O extends () => Promise<any>>(
  operation: O,
  delay: number,
  retries = 1
): ReturnType<O> {
  return new Promise((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason) => {
        if (retries > 0) {
          return wait(delay)
            .then(withRetry.bind(null, operation, delay, retries - 1))
            .then(resolve)
            .catch(reject);
        }

        return reject(reason);
      });
  }) as any;
}

export function bytesToSize(bytes: number, precision: number = 0) {
  var kilobyte = 1024;
  var megabyte = kilobyte * 1024;
  var gigabyte = megabyte * 1024;
  var terabyte = gigabyte * 1024;

  if (bytes >= 0 && bytes < kilobyte) {
    return bytes + "b";
  } else if (bytes >= kilobyte && bytes < megabyte) {
    return (bytes / kilobyte).toFixed(precision) + "kb";
  } else if (bytes >= megabyte && bytes < gigabyte) {
    return (bytes / megabyte).toFixed(precision) + "mb";
  } else if (bytes >= gigabyte && bytes < terabyte) {
    return (bytes / gigabyte).toFixed(precision) + "gb";
  } else if (bytes >= terabyte) {
    return (bytes / terabyte).toFixed(precision) + "tb";
  } else {
    return bytes + "b";
  }
}

export function timeSince(date: Date | number) {
  //@ts-ignore
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " yrs";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hrs";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

export function compareByName(a: { name: string }, b: { name: string }) {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();

  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  return 0;
}

export function isDefined(value: any) {
  if (typeof value === "undefined" || value === null) {
    return false;
  }

  return true;
}

export function createProccessOutputStreamer(cmd: string, params: string[]) {
  return async function streamProcessOutput(
    request: Request<any, any, any, any>,
    response: Response
  ) {
    const child = spawn(cmd, params);
    const processId = String(ObjectID());
    const { io, session } = request;
    const room = io.to(session.id);
    let ended = false;

    const socketsInRoom = (await room.fetchSockets()).reduce((acc, { id }) => {
      const socket = io.sockets.sockets.get(id);
      return socket ? [...acc, socket] : acc;
    }, [] as Socket[]);

    const end = () => {
      if (ended) {
        return;
      }

      request.log.info(
        `streaming ended for process ${processId} and session ${session.id} [${[
          cmd,
          ...params,
        ].join(" ")}]`
      );

      socketsInRoom.forEach((socket) => {
        socket.off(`process-output:kill:${processId}`, end);
        socket.off("disconnect", end);
      });

      try {
        child.kill();
      } catch (_) {}
    };

    const emitLog = (message: string) => {
      logger.debug(`[process-output:log:${processId}]: ${message}`);
      room.emit(`process-output:log:${processId}`, message);
    };

    request.log.info(
      `streaming started for process ${processId} and session ${session.id} [${[
        cmd,
        ...params,
      ].join(" ")}]`
    );

    socketsInRoom.forEach((socket) => {
      socket.on(`process-output:kill:${processId}`, end);
      socket.on("disconnect", end);
    });

    child.stdout.on("data", (data) => emitLog(data.toString()));
    child.stderr.on("data", (data) => emitLog(data.toString()));
    child.on("close", end);

    response.send({ processId });
  };
}

function createAppModuleInstance(router: Router) {
  function createMethod(
    method: "get" | "post" | "patch" | "put" | "delete" | "head"
  ) {
    return function defineRoute<
      Config extends {
        Params?: object;
        Body?: object;
        Query?: object;
        Response?: object;
      }
    >(
      path: string,
      handler: (
        req: Request<
          Config["Params"],
          Config["Response"],
          Config["Body"],
          Config["Query"]
        >,
        res: Response<Config["Response"]>
      ) => Promise<Config["Response"]> | undefined | void
    ) {
      router[method](
        path,
        (
          req: Request<
            Config["Params"],
            Config["Response"],
            Config["Body"],
            Config["Query"]
          >,
          res: Response<Config["Response"]>
        ) => {
          const result = handler(req, res);

          if (typeof result === "undefined") {
            return;
          }

          result.then(
            (result) => res.send(result),
            (error) => res.status(500).send({ error } as any)
          );
        }
      );
    };
  }

  return {
    router,
    get: createMethod("get"),
    post: createMethod("post"),
    patch: createMethod("patch"),
    put: createMethod("put"),
    delete: createMethod("delete"),
    head: createMethod("head"),
  };
}

type AppModuleInstance = ReturnType<typeof createAppModuleInstance>;

const pinoHttp = pino({
  level: "warn",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname,req.headers.authorization",
    },
  },
});

export { pinoHttp };

export const logger = pinoHttp.logger;

export function createAppModule(
  name: string,
  defineAppModule: (
    instance: AppModuleInstance,
    logger: HttpLogger["logger"]
  ) => void
) {
  const router = Router();

  return {
    name,
    setup: async () => {
      await defineAppModule(createAppModuleInstance(router), logger);
      return router;
    },
  };
}
