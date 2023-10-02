import { uniqBy } from "lodash";
import { OmbiMedia } from "@home-control/types/ombi";
import { createAppModule } from "../../utils";
import {
  ombi,
  radarr,
  sonarr,
  fetchMediaData,
  getRadarrItem,
  getSonarrItem,
  getOmbiItem,
} from "./utils";

function prepareResponse(items: (OmbiMedia | null)[]) {
  return uniqBy(items.filter(Boolean), "tmdbId") as OmbiMedia[];
}

export default createAppModule("ombi", (instance) => {
  instance.get("/recently-requested", () => {
    return ombi
      .get("v2/Requests/recentlyRequested")
      .then((res: any) =>
        Promise.all(
          res.data.map((ombiData: any) =>
            fetchMediaData(ombiData.mediaId, ombiData.type)
          )
        )
      )
      .then(prepareResponse);
  });

  instance.get("/trending", () => {
    return Promise.all([
      ombi.get("v2/search/Tv/trending/0/10"),
      ombi.get("v2/search/Movie/nowplaying/0/10"),
    ])
      .then(([res1, res2]) => [...res1.data, ...res2.data])
      .then((data) =>
        Promise.all(
          data.map((ombiData: any) =>
            fetchMediaData(ombiData.id, ombiData.type)
          )
        )
      )
      .then(prepareResponse);
  });

  instance.get<{ Params: { term: string } }>("/search/:term", (req) => {
    return ombi
      .post(`v2/search/multi/${req.params.term}`, {
        movies: true,
        tvShows: true,
        people: false,
        music: false,
      })
      .then((res) =>
        Promise.all(
          res.data.map((ombiSearchData: any) =>
            getOmbiItem(ombiSearchData.id, ombiSearchData.mediaType)
              .then((res) => res.data)
              .then((ombiData) => fetchMediaData(ombiData.id, ombiData.type))
          )
        )
      )
      .then(prepareResponse);
  });

  instance.get("/quality-profiles", () =>
    Promise.all([
      ombi.get("/v1/Radarr/Profiles/").then((res) => res.data),
      ombi.get("/v1/Sonarr/Profiles/").then((res) => res.data),
    ]).then(([movie, tv]) => ({ movie, tv }))
  );

  instance.post<{
    Body: {
      tmdbId: string;
      type: OmbiMedia["type"];
      qualityProfile: number;
    };
  }>("/request", (req) => {
    const { tmdbId, type, qualityProfile } = req.body;

    if (type === "movie") {
      return ombi
        .post("/v1/Request/Movie/", {
          theMovieDbId: tmdbId,
          qualityPathOverride: qualityProfile,
        })
        .then(() => ({ success: true }));
    }

    return ombi
      .post("/v2/Requests/TV/", {
        firstSeason: false,
        latestSeason: false,
        requestAll: true,
        theMovieDbId: tmdbId,
        qualityPathOverride: qualityProfile,
      })
      .then(() => ({ success: true }));
  });

  instance.delete<{ Params: { tmdbId: string } }>(
    "/movie/request/:tmdbId",
    async (req) => {
      const { tmdbId } = req.params;

      const { data: ombiData } = await getOmbiItem(tmdbId, "movie");

      const radarrItem = await getRadarrItem(tmdbId);
      const radarrItemId = radarrItem?.id;

      await Promise.all([
        ombiData.requestId &&
          ombi.delete(`/v1/Request/movie/${ombiData.requestId}`),
        radarrItemId &&
          radarr.delete(
            `/v3/movie/${radarrItemId}?collectionTmdbId=&deleteFiles=true&addImportExclusion=false`
          ),
      ]);

      return { success: true };
    }
  );

  instance.delete<{ Params: { tmdbId: string } }>(
    "/tv/request/:tmdbId",
    async (req) => {
      const { tmdbId } = req.params;

      const sonnarItem = await getSonarrItem(tmdbId);
      const sonarrItemId = sonnarItem?.id;

      await Promise.all([
        ombi.delete(`/v1/Request/tv/child/${tmdbId}`),
        sonarrItemId &&
          sonarr.delete(
            `/v3/series/${sonarrItemId}?deleteFiles=true&addImportListExclusion=false`
          ),
      ]);

      return { success: true };
    }
  );
});
