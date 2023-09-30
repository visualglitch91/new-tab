import * as jdownloader from "jdownloader-api";
import { createAppModule } from "../../utils";
import { config } from "../../../../config";
import { JDownloaderItem } from "../../../types/jdownloader";

const { username, password } = config.jdownloader;

async function connect() {
  await jdownloader.disconnect();
  return jdownloader.connect(username, password);
}

export default createAppModule("jdownloader", async (instance, logger) => {
  let deviceId: string | null = null;

  await connect();

  async function getDeviceId() {
    if (!deviceId) {
      const devices: { id: string }[] = await jdownloader.listDevices();

      if (devices.length > 0) {
        deviceId = devices[0].id;
      }
    }

    return deviceId;
  }

  async function retryOn403<T>(func: () => Promise<T>) {
    try {
      return await func();
    } catch (err: any) {
      if (err === 403) {
        await connect();
        return func();
      }

      throw err;
    }
  }

  instance.get("/downloads", () => {
    return retryOn403(async () => {
      const deviceId = await getDeviceId();

      if (!deviceId) {
        return [];
      }

      return jdownloader
        .queryLinks(deviceId)
        .then((res: { data: JDownloaderItem }) => res.data);
    });
  });

  instance.post<{ Body: { id: string } }>("/remove", (req) => {
    return retryOn403(async () => {
      const deviceId = await getDeviceId();

      if (!deviceId) {
        throw new Error("device not found");
      }

      await jdownloader.cleanUpLink(deviceId, req.body.id);
    });
  });

  instance.post<{ Body: { url: string } }>("/add", (req) => {
    return retryOn403(async () => {
      const deviceId = await getDeviceId();

      if (!deviceId) {
        throw new Error("device not found");
      }

      await jdownloader.addLinks([req.body.url], deviceId, true);
    });
  });
});
