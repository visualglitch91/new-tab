import { job } from "cron";
import path from "path";
import { exec } from "child_process";
import { createAppModule, withRetry } from "../../helpers";
import { config } from "../../../../config";

const cameras = config.camera_snapshots;
const snapshotDir = `${__dirname}/snapshots/`;

function captureSnapshot(name: string, source: string, snapshotDir: string) {
  const tmpFile = `${snapshotDir}/${name}-tmp.jpg`;
  const finalFile = `${snapshotDir}/${name}.jpg`;

  const command = `
      rm -rf ${tmpFile} &&
      /usr/bin/ffmpeg -i ${source} -ss 00:00:01 -f image2 -vframes 1 ${tmpFile} &&
      rm -rf ${finalFile} &&
      mv ${tmpFile} ${finalFile}
    `;

  return new Promise<void>((resolve, reject) =>
    exec(command, (err) => {
      if (err) {
        return reject();
      }

      resolve();
    })
  );
}

export default createAppModule("camera-snapshots", (instance) => {
  job("*/10 * * * * *", async () => {
    let name: keyof typeof cameras;

    for (name in cameras) {
      await withRetry(
        () => captureSnapshot(name, cameras[name], snapshotDir),
        500
      ).then(
        () => instance.log.info(`snapshot captured from camera "${name}"`),
        () => {}
      );
    }
  }).start();

  instance.register(require("@fastify/static"), {
    root: path.resolve(snapshotDir),
  });
});
