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

  async function run<T>(func: () => Promise<T>) {
    try {
      return await func();
    } catch (err: any) {
      if (String(err?.message).includes("AUTH_FAILED")) {
        await jdownloaderAPI.disconnect();
        await connect();
        return func();
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
