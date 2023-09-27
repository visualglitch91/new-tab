import { exec } from "child_process";
import { withRetry } from "../..helpers";

const cameras = config as Record<string, string>;
const snapshotDir = `${__dirname}/snapshots/`;

app.use("/snapshots", express.static(snapshotDir));

export function captureSnapshot(
  name: string,
  source: string,
  snapshotDir: string
) {
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

async function loop() {
  for (const name in cameras) {
    await withRetry(
      () => captureSnapshot(name, cameras[name], snapshotDir),
      500,
      1
    ).catch(() => {});
  }

  setTimeout(loop, 10_000);
}

loop();

app.listen(port, host, () => {
  console.log(`camera-snapshots listening at ${host}:${port}`);
});
