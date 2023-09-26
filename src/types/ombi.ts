export interface OmbiMedia {
  id: string;
  type: "tv" | "movie";
  title: string;
  overview: string;
  releaseDate: string;
  poster: string;
  request?: {
    id: string;
    status: "available" | "partially" | "approved" | "denied" | "pending";
  };
}
