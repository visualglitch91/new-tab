import axios from "axios";
import { MediaItem } from "@home-control/types/media-center";
import { config } from "../../../../../config";

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org",
  headers: { Authorization: `Bearer ${config.tmdb.key}` },
});

export const radarr = axios.create({
  baseURL: `${config.radarr.url}/api`,
  headers: { "X-Api-Key": config.radarr.key },
});

export const sonarr = axios.create({
  baseURL: `${config.sonarr.url}/api`,
  headers: { "X-Api-Key": config.sonarr.key },
});

export function movieLookup(term: string) {
  return radarr.get(`/v3/movie/lookup?term=${term}`).then((res) => res.data);
}

export function tvLookup(term: string) {
  return sonarr.get(`/v3/series/lookup?term=${term}`).then((res) => res.data);
}

export function getRadarrItem(tmdbId: string) {
  return movieLookup(`tmdb%3A${tmdbId}`).then((res) => res[0]);
}

export function getSonarrItem(tvdbId: string) {
  return tvLookup(`tvdb%3A${tvdbId}`).then((res) => res[0]);
}

function getShowAvailability(tvdbId: string) {
  return sonarr
    .get(`/v3/series?tvdbId=${tvdbId}`)
    .then((res) => res.data[0])
    .then((data) => {
      if (!data) {
        return "not-available";
      }

      return data.statistics.percentOfEpisodes === 100
        ? "available"
        : data.statistics.percentOfEpisodes === 0
        ? "not-available"
        : "partially";
    });
}

export async function fetchMediaData(data: any) {
  const availability =
    data.type === "movie"
      ? data.hasFile
        ? ("available" as const)
        : ("not-available" as const)
      : await getShowAvailability(data.tvdbId).catch((error) => {
          console.error(data, error);
          return "not-available" as const;
        });

  const notMonitored = !data.added || data.added.startsWith("0001");

  const media: MediaItem = {
    itemId: data.id,
    mediaId: data.type === "movie" ? data.tmdbId : data.tvdbId,
    type: data.type,
    title: data.title,
    overview: data.overview,
    year: data.year,
    poster: data.images.find((it: any) => it.coverType === "poster")?.url,
    requestedAt: notMonitored ? undefined : data.added,
    status:
      availability !== "not-available"
        ? availability
        : notMonitored
        ? "not-monitored"
        : "monitored",
  };

  return media;
}
