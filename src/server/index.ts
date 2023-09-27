import "dotenv/config";
import path from "path";
import Fastify from "fastify";
import { auth } from "./auth";

const host = "0.0.0.0";
const port = Number(process.env.PORT) || 5700;

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
});

fastify.register(auth, { prefix: "/api" });

const modules = import.meta.glob("./modules/*/index.ts", { eager: true });

for (let key in modules) {
  //@ts-ignore
  const { default: mod } = modules[key];
  fastify.log.info(`module loaded: ${mod.name}`);
  fastify.register(mod.plugin, { prefix: `/api/${mod.name}` });
}

fastify.register(require("@fastify/static"), {
  root: path.resolve(__dirname + "/../../dist"),
});

try {
  await fastify.listen({ host, port });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
