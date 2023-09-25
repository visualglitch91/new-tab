import { type Request, type Response, Router } from "express";

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

export function createAppModule(name: string) {
  const router = Router();
  const logger = createLogger(name);

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
      ) => Promise<Config["Response"]>
    ) {
      router[method](
        `/${name}${path}`,
        (
          req: Request<
            Config["Params"],
            Config["Response"],
            Config["Body"],
            Config["Query"]
          >,
          res: Response<Config["Response"]>
        ) => {
          handler(req, res).then(
            (result) => res.send(result),
            (error) => res.status(500).send({ error } as any)
          );
        }
      );
    };
  }

  return {
    ...logger,
    name,
    middleware: router,
    get: createMethod("get"),
    post: createMethod("post"),
    patch: createMethod("patch"),
    put: createMethod("put"),
    delete: createMethod("delete"),
    head: createMethod("head"),
  };
}

export function createLogger(name: string) {
  return {
    log(...args: any) {
      console.log(...[`(${name})`, ...args]);
    },
    error(...args: any) {
      console.error(...[`(${name})`, ...args]);
    },
  };
}
