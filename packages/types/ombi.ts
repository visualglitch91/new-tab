export type OmbiMedia = {
  tmdbId: string;
  title: string;
  overview: string;
  year: number;
  poster: string | null;
  request?: {
    id: string;
    status: "available" | "partially" | "approved" | "denied" | "pending";
  };
} & ({ type: "movie" } | { tvdbId: string; type: "tv" });

export interface QualityProfile {
  id: string;
  name: string;
}
