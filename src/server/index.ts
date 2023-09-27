import path from "path";
import Fastify from "fastify";
import { config } from "../../config";
import { auth } from "./auth";

const port =
  process.env.NODE_ENV === "dev" ? config.development_server_port : config.port;

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

fastify.log.info(`NODE_ENV: ${process.env.NODE_ENV}`);

//@ts-expect-error
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
  await fastify.listen({ host: "0.0.0.0", port });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
