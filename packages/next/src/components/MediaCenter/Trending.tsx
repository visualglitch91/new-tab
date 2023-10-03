import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@home-control/types/media-center";
import api from "../../utils/api";
import MediaListCard from "./MediaListCard";

export default function Trending() {
  const { data = [], isInitialLoading } = useQuery(
    ["media-center", "trending"],
    ({ signal }) =>
      api<MediaItem[]>("/media-center/trending", "get", undefined, {
        signal,
      }),
    { refetchInterval: 20_000 }
  );

  return <MediaListCard items={data} loading={isInitialLoading} />;
}
