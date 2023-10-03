import { useMutation, useQuery } from "@tanstack/react-query";
import { MediaItem } from "@home-control/types/media-center";
import { queryClient } from "../../utils/queryClient";
import api from "../../utils/api";
import MediaListCard from "./MediaListCard";
import DotLoading from "../DotLoading";
import AltIconButton from "../AltIconButton";
import Icon from "../Icon";

function DeleteRequestButton({ item }: { item: MediaItem }) {
  const deleteRequest = useMutation(
    () => api(`/media-center/${item.type}/request/${item.itemId!}`, "delete"),
    { onSuccess: () => queryClient.refetchQueries(["media-center"]) }
  );

  if (deleteRequest.isLoading) {
    return <DotLoading />;
  }

  return (
    <AltIconButton onClick={() => deleteRequest.mutate()}>
      <Icon size={14} icon="close" />
    </AltIconButton>
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
      items={data}
      loading={isInitialLoading}
      itemAction={(item) => <DeleteRequestButton item={item} />}
    />
  );
}
