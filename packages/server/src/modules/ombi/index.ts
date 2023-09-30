import axios from "axios";
import { createAppModule } from "../../utils";
import { createOmbiMedia } from "./utils";
import { config } from "../../../../../config";

const { url: host, key } = config.ombi;

export default createAppModule("ombi", (instance) => {
  const client = axios.create({
    baseURL: `${host}/ombi/api`,
    headers: { ApiKey: key },
  });

  instance.get("/recently-requested", () => {
    return client.get("/v2/Requests/recentlyRequested").then((res) =>
      Promise.all(
        res.data.map((it: any) =>
          createOmbiMedia(
            it.mediaId,
            it.type,
            it.title,
            it.overview,
            it.releaseDate,
            it.posterPath,
            {
              id: String(it.requestId),
              status: it.tvPartiallyAvailable
                ? "partially"
                : it.available
                ? "available"
                : it.approved
                ? "approved"
                : it.denied
                ? "denied"
                : "pending",
            }
          )
        )
      )
    );
  });

  instance.get("/popular", () => {
    return Promise.all([
      client.get("/v2/search/Tv/popular/0/10"),
      client.get("/v2/search/Movie/popular/0/10"),
    ])
      .then(([res1, res2]) => [...res1.data, ...res2.data])
      .then((data) =>
        Promise.all(
          data.map((it: any) =>
            createOmbiMedia(
              String(it.id),
              it.type,
              it.title,
              it.overview,
              it.releaseDate,
              it.posterPath,
              it.requested
                ? {
                    id: String(it.requestId),
                    status: it.partlyAvailable
                      ? "partially"
                      : it.available
                      ? "available"
                      : it.approved
                      ? "approved"
                      : it.denied
                      ? "denied"
                      : "pending",
                  }
                : undefined
            )
          )
        )
      );
  });
});
