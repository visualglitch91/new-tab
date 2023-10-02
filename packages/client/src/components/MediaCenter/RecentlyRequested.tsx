import { useMutation, useQuery } from "@tanstack/react-query";
import { MediaItem } from "@home-control/types/media-center";
import { queryClient } from "../../utils/queryClient";
import api from "../../utils/api";
import PillButton from "../PillButton";
import MediaListCard from "./MediaListCard";
import DotLoading from "../DotLoading";

function DeleteRequestButton({ item }: { item: MediaItem }) {
  const deleteRequest = useMutation(
    () => api(`/media-center/${item.type}/request/${item.itemId!}`, "delete"),
    { onSuccess: () => queryClient.refetchQueries(["media-center"]) }
  );

  if (deleteRequest.isLoading) {
    return <DotLoading />;
  }

  return (
    <PillButton
      sx={{ borderRadius: "100%", width: "20px", height: "20px" }}
      icon="close"
      onClick={() => deleteRequest.mutate()}
    />
  );
}

export default function RecentlyRequested() {
  const { data = [], isInitialLoading } = useQuery(
    ["media-center", "recently-requested"],
    () => api<MediaItem[]>("/media-center/recently-requested", "get"),
    { refetchInterval: 20_000 }
  );

  return (
    <MediaListCard
      title="Últimas Requisições"
      items={data}
      loading={isInitialLoading}
      itemAction={(item) => <DeleteRequestButton item={item} />}
    />
  );
}
