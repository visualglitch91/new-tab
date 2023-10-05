import axios from "axios";
import { Torrent } from "@home-control/types/transmission";
import { createAppModule } from "../../utils";
import { config } from "../../../../../config";

const { url: host } = config.transmission;

let sessionId = "";
let tagCounter = 1;

async function transmission<T = object>(
  method: string,
  params: any
): Promise<T> {
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
            return transmission(body);
          }
        }

        throw error;
      }
    );
}

export default createAppModule("transmission", (instance) => {
  instance.get("/torrents", () => {
    return transmission<{ torrents: Torrent }>("torrent-get", {
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

  instance.post<{ Body: { ids: string[] } }>("/start", (req) => {
    return transmission<{ torrents: Torrent }>("torrent-start", {
      ids: req.body.ids.map(Number),
    });
  });

  instance.post<{ Body: { ids: string[] } }>("/stop", (req) => {
    return transmission<{ torrents: Torrent }>("torrent-stop", {
      ids: req.body.ids.map(Number),
    });
  });

  instance.post<{ Body: { ids: string[]; deleteData?: boolean } }>(
    "/remove",
    (req) => {
      return transmission<{ torrents: Torrent }>("torrent-remove", {
        ids: req.body.ids.map(Number),
        "delete-local-data": req.body.deleteData,
      });
    }
  );

  instance.post<{ Body: { magnet: string } }>("/add", (req) => {
    return transmission<{ torrents: Torrent }>("torrent-add", {
      start: true,
      bandwidthPriority: 0,
      downloadDir: "",
      paused: false,
      filename: req.body.magnet,
    });
  });
});
