import { job } from "cron";
//@ts-expect-error
import jdownloaderAPI from "./api";
import { createAppModule } from "../../helpers";
import { config } from "../../../../config";
import { JDownloaderItem } from "../../../types/jdownloader";

const { username, password } = config.jdownloader;

function connect() {
  return jdownloaderAPI.connect(username, password);
}

job("0 * * * *", () => {
  jdownloaderAPI.reconnect();
}).start();

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

  instance.get("/downloads", async () => {
    const deviceId = await getDeviceId();

    if (!deviceId) {
      return [];
    }

    return jdownloaderAPI
      .queryLinks(deviceId)
      .then((res: { data: JDownloaderItem }) => res.data);
  });

  instance.post<{ Body: { id: string } }>("/remove", async (req) => {
    const deviceId = await getDeviceId();

    if (!deviceId) {
      throw new Error("device not found");
    }

    await jdownloaderAPI.cleanUpLink(deviceId, req.body.id);

    return;
  });

  instance.post<{ Body: { url: string } }>("/add", async (req) => {
    const deviceId = await getDeviceId();

    if (!deviceId) {
      throw new Error("device not found");
    }

    await jdownloaderAPI.addLinks(req.body.url, deviceId, true);

    return;
  });
});
