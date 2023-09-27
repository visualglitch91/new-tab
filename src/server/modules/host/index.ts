import { exec } from "child_process";
import { createAppModule } from "../../helpers";

export default createAppModule("host", (instance) => {
  instance.get("/reboot", (req) => {
    return new Promise<void>((resolve) => {
      exec("sudo /sbin/reboot", (...args) => {
        req.log.info(args.join(" "));
        resolve();
      });
    });
  });
});
