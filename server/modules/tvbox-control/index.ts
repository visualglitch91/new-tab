import PQueue from "p-queue";
import { exec } from "child_process";
import { createAppModule } from "../../utils";
import config from "$server/config";

const queue = new PQueue({ concurrency: 1 });
const adbHost = config.tvbox.adb_host;

export default createAppModule("tvbox-control", (instance, logger) => {
  function adbShell(...cmds: string[]) {
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

  instance.post<{ Body: { activity: string } }>("/launch", (req) => {
    return adbShell(
      "input keyevent KEYCODE_HOME",
      `am start ${req.body.activity}`
    );
  });

  instance.post("/reboot", async () => {
    await adbShell("reboot userspace");
    return undefined;
  });

  instance.post<{ Body: { keycode: string } }>("/keycode", async (req) => {
    await adbShell(`input keyevent ${req.body.keycode}`);
    return undefined;
  });

  instance.post("/max-volume", async () => {
    await adbShell("cmd media_session volume --set 15");
    return undefined;
  });
});
