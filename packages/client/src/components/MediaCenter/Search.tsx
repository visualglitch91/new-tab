import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@home-control/types/media-center";
import api from "../../utils/api";
import MediaListCard from "./MediaListCard";

export default function Search({ term }: { term: string }) {
  const {
    data = [],
    isInitialLoading,
    isLoading,
  } = useQuery(
    ["media-center", "search", term],
    ({ signal }) =>
      api<MediaItem[]>(`/media-center/search/${term}`, "get", undefined, {
        signal,
      }),
    { refetchInterval: 20_000, enabled: !!term }
  );

  return (
    <MediaListCard items={data} loading={term ? isLoading : isInitialLoading} />
  );
}
