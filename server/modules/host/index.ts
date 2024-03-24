import { exec } from "child_process";
import { createAppModule } from "$server/utils";

export default createAppModule("host", (instance) => {
  instance.get("/reboot", (req) => {
    return new Promise<undefined>((resolve) => {
      exec("sudo /sbin/reboot", (...args) => {
        req.log.info(args.join(" "));
        resolve(undefined);
      });
    });
  });
});
