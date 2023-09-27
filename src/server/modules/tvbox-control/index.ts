import PQueue from "p-queue";
import { exec } from "child_process";
import { FastifyBaseLogger } from "fastify";
import { createAppModule } from "../../helpers";
import { config } from "../../../../config";

const queue = new PQueue({ concurrency: 1 });
const adbHost = config.tvbox.adb_host;

function adbShell(logger: FastifyBaseLogger, ...cmds: string[]) {
  return queue.add(() => {
    return new Promise<void>((resolve) => {
      const fullCmd = [
        `adb connect ${adbHost}`,
        ...cmds.map((cmd) => `adb shell ${cmd}`),
        `adb disconnect ${adbHost}`,
      ].join(" && ");

      exec(fullCmd, (...args) => {
        logger.info(`command: ${fullCmd}`);
        logger.info(`response: ${args}`);
        resolve();
      });
    });
  });
}

export default createAppModule("tvbox-control", (instance) => {
  instance.post<{ Body: { activity: string } }>("/launch", (req) => {
    return adbShell(
      req.log,
      "input keyevent KEYCODE_HOME",
      `am start ${req.body.activity}`
    );
  });

  instance.post("/reboot", (req) => {
    return adbShell(req.log, "reboot userspace");
  });

  instance.post<{ Body: { keycode: string } }>("/keycode", (req) => {
    return adbShell(req.log, `input keyevent ${req.body.keycode}`);
  });

  instance.post("/max-volume", (req) => {
    return adbShell(req.log, "cmd media_session volume --set 15");
  });
});
