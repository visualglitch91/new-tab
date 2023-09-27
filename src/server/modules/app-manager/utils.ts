import { spawn } from "child_process";
import { FastifyReply } from "fastify";

export function createProccessOutputStreamer(cmd: string, params: string[]) {
  return function streamProcessOutput(reply: FastifyReply) {
    const child = spawn(cmd, params);
    const log = reply.request.log;

    log.info(`streaming output for ${cmd} ${params.join(" ")}`);

    child.stdout.on("data", (data) => {
      reply.raw.write(data);
    });

    child.stderr.on("data", (data) => {
      reply.raw.write(data);
    });

    child.on("close", () => {
      try {
        reply.raw.end();
      } catch (_) {}
    });

    reply.request.raw.on("close", () => {
      log.info(`streaming ended for ${cmd} ${params.join(" ")}`);

      try {
        child.kill();
      } catch (_) {}
    });
  };
}
