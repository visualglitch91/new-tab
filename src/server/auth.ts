import axios from "axios";
import type { NextFunction, Response, Request } from "express";

export function auth() {
  const keyCache: Record<string, true> = {};

  return function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res.sendStatus(401);
    }

    if (keyCache[token]) {
      return next();
    }

    axios
      .get(process.env.VITE_HASS_URL!, {
        headers: { authorization: token },
      })
      .then((res) => {
        if (res.status === 200) {
          keyCache[token] = true;
          return next();
        } else {
          return Promise.reject();
        }
      })
      .catch(() => {
        return res.sendStatus(401);
      });
  };
}
