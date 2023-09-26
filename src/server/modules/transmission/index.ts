import axios from "axios";
import { createAppModule } from "../../helpers";
import { Torrent } from "../../../types/transmission";

const appModule = createAppModule("transmission");
const host = process.env.VITE_TRANSMISSION_URL!;

let tagCounter = 1;
let sessionId = "";

async function api<T = object>(method: string, params: any): Promise<T> {
  const body = { method, arguments: params, tag: tagCounter++ };

  return axios
    .post(`${host}/transmission/rpc`, body, {
      headers: sessionId ? { "x-transmission-session-id": sessionId } : {},
    })
    .then(
      (res: any) => {
        if (res.data.result === "success") {
          return res.data.arguments;
        }

        throw res.data;
      },
      (error) => {
        if (error.response?.status) {
          const sessionIdValue =
            error.response?.headers["x-transmission-session-id"];

          if (sessionIdValue) {
            sessionId = sessionIdValue;
            //@ts-expect-error
            return api(body);
          }
        }

        throw error;
      }
    );
}

appModule.get("/torrents", () => {
  return api<{ torrents: Torrent }>("torrent-get", {
    fields: [
      "id",
      "name",
      "percentDone",
      "uploadRatio",
      "rateDownload",
      "rateUpload",
      "downloadedEver",
      "uploadedEver",
      "totalSize",
      "addedDate",
      "status",
      "errorString",
      "activityDate",
      "sizeWhenDone",
      "eta",
      "recheckProgress",
      "queuePosition",
      "downloadDir",
    ],
  }).then((res) => res.torrents);
});

appModule.post<{ Body: { ids: string[] } }>("/start", (req) => {
  return api<{ torrents: Torrent }>("torrent-start", {
    ids: req.body.ids,
  });
});

appModule.post<{ Body: { ids: string[] } }>("/stop", (req) => {
  return api<{ torrents: Torrent }>("torrent-stop", {
    ids: req.body.ids,
  });
});

appModule.post<{ Body: { ids: string[]; deleteData?: boolean } }>(
  "/remove",
  (req) => {
    return api<{ torrents: Torrent }>("torrent-remove", {
      ids: req.body.ids,
      "delete-local-data": req.body.deleteData,
    });
  }
);

appModule.post<{ Body: { magnet: string } }>("/add", (req) => {
  return api<{ torrents: Torrent }>("torrent-add", {
    start: true,
    bandwidthPriority: 0,
    downloadDir: "",
    paused: false,
    filename: req.body.magnet,
  });
});

export default appModule;
