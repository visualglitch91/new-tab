import axios from "axios";
import { orderBy } from "lodash";
import { MediaItem } from "@home-control/types/media-center";
import { createAppModule } from "../../utils";
import {
  radarr,
  sonarr,
  tmdb,
  fetchMediaData,
  movieLookup,
  tvLookup,
  getSonarrItem,
  getRadarrItem,
} from "./utils";
import { config } from "../../../../../config";

export default createAppModule("media-center", (instance) => {
  instance.get("/recently-requested", () => {
    return Promise.all([radarr.get("/v3/movie"), sonarr.get("/v3/series")])
      .then(([movies, series]) => [
        ...movies.data.map((it: any) => ({ ...it, type: "movie" })),
        ...series.data.map((it: any) => ({ ...it, type: "tv" })),
      ])
      .then((data) => Promise.all(data.map((item) => fetchMediaData(item))))
      .then((data) => orderBy(data, ["requestedAt"], ["desc"]).slice(0, 20));
  });

  instance.get("/trending", () => {
    return tmdb
      .get("/3/trending/all/week")
      .then((res) =>
        (res.data.results as any[]).map((item: any) => {
          const year = (item.release_date || item.first_air_date).substring(
            0,
            4
          );

          return {
            title: item.title || (item.name as string),
            type: item.media_type as "movie" | "tv",
            year: year && Number(year),
          };
        })
      )
      .then((data) =>
        Promise.all(
          data.map((item) =>
            (item.type === "movie"
              ? movieLookup(item.title)
                  .then((res) => res[0])
                  .then((it: any) => ({ ...it, type: "movie" }))
              : tvLookup(item.title)
                  .then((res) => res[0])
                  .then((it: any) => ({ ...it, type: "tv" }))
            )
              .then(fetchMediaData)
              .then((media) => (item.year === media.year ? media : null))
          )
        )
      )
      .then((data) => data.filter(Boolean));
  });

  instance.get<{ Params: { term: string } }>("/search/:term", (req) => {
    return Promise.all([
      movieLookup(req.params.term).then((res: any) =>
        res.map((it: any) => ({ ...it, type: "movie" })).slice(0, 10)
      ),
      tvLookup(req.params.term).then((res: any) =>
        res.map((it: any) => ({ ...it, type: "tv" })).slice(0, 10)
      ),
    ])
      .then((data) => Promise.all(data.flat().map(fetchMediaData)))
      .then((data) => orderBy(data, ["title"], ["asc"]));
  });

  instance.get("/quality-profiles", () => {
    const parse = (it: any) => ({ id: it.id, name: it.name });

    return Promise.all([
      radarr.get("/v3/qualityprofile").then((res) => res.data.map(parse)),
      sonarr.get("/v3/qualityprofile").then((res) => res.data.map(parse)),
    ]).then(([movie, tv]) => ({ movie, tv }));
  });

  instance.post<{
    Body: {
      mediaId: string;
      type: MediaItem["type"];
      qualityProfile: number;
    };
  }>("/request", async (req) => {
    const { mediaId, type, qualityProfile } = req.body;

    if (type === "tv") {
      const [media, languageProfileId, rootFolderPath] = await Promise.all([
        getSonarrItem(mediaId),
        sonarr.get("/v3/languageprofile").then((res) => res.data[0].id),
        sonarr.get("/v3/rootFolder").then((res) => res.data[0].path),
      ]);

      await sonarr
        .post("/v3/series", {
          ...media,
          languageProfileId,
          qualityProfileId: qualityProfile,
          path: `${rootFolderPath}/${media.title}`,
          rootFolderPath: `${rootFolderPath}/`,
          addOptions: {
            monitor: "all",
            searchForMissingEpisodes: true,
            searchForCutoffUnmetEpisodes: false,
          },
        })
        .catch(req.log.error);
    } else {
      const [media, rootFolderPath] = await Promise.all([
        getRadarrItem(mediaId),
        radarr.get("/v3/rootFolder").then((res) => res.data[0].path),
      ]);

      await radarr
        .post("/v3/movie", {
          ...media,
          qualityProfileId: qualityProfile,
          path: `${rootFolderPath}/${media.title}`,
          rootFolderPath: `${rootFolderPath}/`,
          addOptions: {
            searchForMovie: true,
            addMethod: "manual",
            ignoreEpisodesWithFiles: false,
            ignoreEpisodesWithoutFiles: false,
            monitor: "movieOnly",
          },
        })
        .catch(req.log.error);
    }

    return { success: true };
  });

  instance.delete<{ Params: { type: MediaItem["type"]; itemId: string } }>(
    "/:type/request/:itemId",
    async (req) => {
      const { type, itemId } = req.params;

      await (type === "movie"
        ? radarr.delete(
            `/v3/movie/${itemId}?deleteFiles=true&addImportExclusion=false`
          )
        : sonarr.delete(
            `/v3/series/${itemId}?deleteFiles=true&addImportListExclusion=false`
          ));

      return { success: true };
    }
  );

  instance.get<{
    Params: { type: MediaItem["type"] };
    Query: { path: string };
  }>("/:type/image-proxy", (req, res) => {
    const baseURL =
      req.params.type === "movie" ? config.radarr.url : config.sonarr.url;

    axios
      .get(`${baseURL}${req.query.path}`, { responseType: "stream" })
      .then((response) => response.data.pipe(res));
  });
});
