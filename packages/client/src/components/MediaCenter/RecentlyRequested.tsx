import { useMutation, useQuery } from "@tanstack/react-query";
import { MediaItem } from "@home-control/types/media-center";
import { queryClient } from "../../utils/queryClient";
import api from "../../utils/api";
import useConfirm from "../../utils/useConfirm";
import MediaListCard from "./MediaListCard";
import DotLoading from "../DotLoading";
import AltIconButton from "../AltIconButton";
import Icon from "../Icon";

function DeleteRequestButton({ item }: { item: MediaItem }) {
  const confirm = useConfirm();

  const deleteRequest = useMutation(
    () => api(`/media-center/${item.type}/request/${item.itemId!}`, "delete"),
    { onSuccess: () => queryClient.refetchQueries(["media-center"]) }
  );

  if (deleteRequest.isLoading) {
    return <DotLoading />;
  }

  return (
    <AltIconButton
      sx={{ "--size": "24px" }}
      onClick={() => {
        confirm({
          title: "Tem certeza que quer continuar?",
          description: "Todos os arquivos serão deletados.",
          onConfirm: () => deleteRequest.mutate(),
        });
      }}
    >
      <Icon size={12} icon="close" />
    </AltIconButton>
  );
}

export default function RecentlyRequested({
  maxHeight,
}: {
  maxHeight?: number;
}) {
  const { data = [], isInitialLoading } = useQuery(
    ["media-center", "recently-requested"],
    () => api<MediaItem[]>("/media-center/recently-requested", "get"),
    { refetchInterval: 20_000 }
  );

  return (
    <MediaListCard
      items={data}
      maxHeight={maxHeight}
      loading={isInitialLoading}
      itemAction={(item) => <DeleteRequestButton item={item} />}
    />
  );
}
