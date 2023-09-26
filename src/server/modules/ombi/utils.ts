import axios from "axios";
import { OmbiMedia } from "../../../types/ombi";

const fanartTVApiKey = process.env.FANART_TV_API_KEY!;

async function fetchMissingPoster(
  id: string,
  type: "tv" | "movie",
  poster?: string | null
) {
  if (poster) {
    return `https://image.tmdb.org/t/p/w300${poster}`;
  }

  const isMovie = type === "movie";

  try {
    const res = await axios.get(
      `http://webservice.fanart.tv/v3/${
        isMovie ? "movies" : "tv"
      }/${id}?api_key=${fanartTVApiKey}`
    );

    const url = isMovie
      ? res.data.movieposter[0]?.url
      : res.data.tvposter[0]?.url;

    if (url) {
      const parts = url.split("/");
      parts[3] = "preview";
      return parts.join("/");
    }
  } catch (_) {}

  return null;
}

export async function createOmbiMedia(
  id: OmbiMedia["id"],
  type: 0 | 1 | "tv" | "movie",
  title: OmbiMedia["title"],
  overview: OmbiMedia["overview"],
  releaseDate: OmbiMedia["releaseDate"],
  poster: OmbiMedia["poster"] | undefined,
  request: OmbiMedia["request"] | undefined
): Promise<OmbiMedia> {
  const normalizedType = type === 0 ? "tv" : type === 1 ? "movie" : type;

  return {
    id,
    type: normalizedType,
    title,
    overview,
    releaseDate,
    poster: await fetchMissingPoster(id, normalizedType, poster),
    request,
  };
}
