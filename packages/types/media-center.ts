export type MediaItem = {
  mediaId: string;
  type: "movie" | "tv";
  title: string;
  overview: string;
  year: number;
  poster: string | null;
} & (
  | {
      itemId: string;
      status: "available" | "partially" | "monitored";
      requestedAt: string;
    }
  | {
      itemId?: undefined;
      status: "not-monitored";
      requestedAt?: undefined;
    }
);

export interface QualityProfile {
  id: string;
  name: string;
}
