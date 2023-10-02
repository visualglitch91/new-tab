import axios from "axios";
import { OmbiMedia } from "@home-control/types/ombi";
import { config } from "../../../../../config";

export const ombi = axios.create({
  baseURL: `${config.ombi.url}/ombi/api`,
  headers: { ApiKey: config.ombi.key },
});

export const radarr = axios.create({
  baseURL: `${config.radarr.url}/api`,
  headers: { "X-Api-Key": config.radarr.key },
});

export const sonarr = axios.create({
  baseURL: `${config.sonarr.url}/api`,
  headers: { "X-Api-Key": config.sonarr.key },
});

export function getRadarrItem(tmdbId: string) {
  return radarr
    .get(`/v3/movie/lookup?term=tmdb%3A${tmdbId}`)
    .then((res) => res.data[0]);
}
export function getSonarrItem(tmdbId: string) {
  return ombi
    .get(`/v2/search/Tv/moviedb/${tmdbId}`)
    .then(({ data }) =>
      data.theTvDbId
        ? sonarr
            .get(`/v3/series/lookup?term=tvdb%3A${data.theTvDbId}`)
            .then((res) => res.data[0])
        : undefined
    );
}

export function getOmbiItem(tmdbId: string, type: OmbiMedia["type"]) {
  return (
    type === "movie"
      ? ombi.get(`/v2/search/Movie/${tmdbId}`)
      : ombi.get(`/v2/search/Tv/moviedb/${tmdbId}`)
  ).then((res) => res.data);
}

export async function fetchRequestObject(
  tmdbId: string,
  type: OmbiMedia["type"]
): Promise<OmbiMedia["request"] | undefined> {
  const ombiItem = await getOmbiItem(tmdbId, type);

  return ombiItem.requested
    ? {
        id: String(ombiItem.requestId),
        status: ombiItem.denied
          ? "denied"
          : ombiItem.tvPartiallyAvailable
          ? "partially"
          : ombiItem.available
          ? "available"
          : ombiItem.approved
          ? "approved"
          : "pending",
      }
    : undefined;
}

const cache: Record<string, any> = {};

export async function fetchMediaData(tmdbId: string, ombiType: 0 | 1) {
  const type = ombiType === 0 ? "tv" : "movie";

  if (!cache[tmdbId]) {
    cache[tmdbId] = await (type === "movie"
      ? getRadarrItem(tmdbId)
      : getSonarrItem(tmdbId));
  }

  const request = await fetchRequestObject(tmdbId, type);

  const data = cache[tmdbId];

  if (!data) {
    return null;
  }

  const media: OmbiMedia = {
    tmdbId,
    //@ts-expect-error
    tvdbId: type === "movie" ? undefined : String(data.tvdbId),
    type,
    title: data.title,
    overview: data.overview,
    year: data.year,
    poster: data.images.find((it: any) => it.coverType === "poster")?.remoteUrl,
    request,
  };

  return media;
}
