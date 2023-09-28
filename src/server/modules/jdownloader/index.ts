//@ts-expect-error
import jdownloaderAPI from "./api";
import { createAppModule, withRetry } from "../../utils";
import { config } from "../../../../config";
import { JDownloaderItem } from "../../../types/jdownloader";

const { username, password } = config.jdownloader;

function connect() {
  return jdownloaderAPI.connect(username, password);
}

export default createAppModule("jdownloader", async (instance) => {
  let deviceId: string | null = null;

  await connect();

  async function getDeviceId() {
    if (!deviceId) {
      const devices: { id: string }[] = await jdownloaderAPI.listDevices();

      if (devices.length > 0) {
        deviceId = devices[0].id;
      }
    }

    return deviceId;
  }

  async function withTimeout<T>(func: () => Promise<T>) {
    return Promise.race([
      func(),
      new Promise((_, reject) => setTimeout(reject, 5000, "timeout")),
    ]) as Promise<T>;
  }

  async function run<T>(func: () => Promise<T>) {
    try {
      return await withTimeout(() => func());
    } catch (err: any) {
      if (
        ["AUTH_FAILED", "TOKEN_INVALID"].some((it) =>
          String(err?.message).includes(it)
        )
      ) {
        await jdownloaderAPI.disconnect();
        await connect();
        return withTimeout(() => func());
      }

      throw err;
    }
  }

  function runWithRetry<T>(func: () => Promise<T>) {
    return withRetry(() => run(func), 1500);
  }

  instance.get("/downloads", () => {
    return runWithRetry(async () => {
      const deviceId = await getDeviceId();

      if (!deviceId) {
        return [];
      }

      return jdownloaderAPI
        .queryLinks(deviceId)
        .then((res: { data: JDownloaderItem }) => res.data);
    });
  });

  instance.post<{ Body: { id: string } }>("/remove", (req) => {
    return runWithRetry(async () => {
      const deviceId = await getDeviceId();

      if (!deviceId) {
        throw new Error("device not found");
      }

      await jdownloaderAPI.cleanUpLink(deviceId, req.body.id);
    });
  });

  instance.post<{ Body: { url: string } }>("/add", (req) => {
    return runWithRetry(async () => {
      const deviceId = await getDeviceId();

      if (!deviceId) {
        throw new Error("device not found");
      }

      await jdownloaderAPI.addLinks(req.body.url, deviceId, true);
    });
  });
});
