import axios from "axios";
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";

export function auth(
  instance: FastifyInstance,
  _: FastifyPluginOptions,
  done: () => void
) {
  const keyCache: Record<string, true> = {};

  instance.addHook(
    "onRequest",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const token = req.headers.authorization;

      if (!token) {
        reply.status(401).send();
        return;
      }

      if (keyCache[token]) {
        return;
      }

      return axios
        .get(process.env.VITE_HASS_URL!, {
          headers: { authorization: token },
        })
        .then((res) => {
          if (res.status === 200) {
            keyCache[token] = true;
            return;
          }

          return Promise.reject();
        })
        .catch(() => {
          reply.status(401).send();
          return;
        });
    }
  );

  done();
}
