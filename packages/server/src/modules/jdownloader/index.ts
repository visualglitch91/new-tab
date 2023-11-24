import axios from "axios";
import { JDownloaderItem } from "@home-control/types/jdownloader";
import { createAppModule } from "../../utils";
import { config } from "../../../../../config";

const { url } = config.jdownloader_http_api;

export default createAppModule("jdownloader", async (instance, logger) => {
  instance.get("/downloads", () => {
    console.log(`${url}/links`);
    return axios
      .get(`${url}/links`)
      .then((res: { data: JDownloaderItem }) => res.data);
  });

  instance.post<{ Body: { ids: string[] } }>("/remove", (req) => {
    return axios
      .post(`${url}/links/delete`, { ids: req.body.ids })
      .then((res: { data: JDownloaderItem }) => res.data);
  });

  instance.post<{ Body: { url: string } }>("/add", (req) => {
    return axios
      .post(`${url}/links`, { url: req.body.url })
      .then((res: { data: JDownloaderItem }) => res.data);
  });
});
