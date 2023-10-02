import { useMutation, useQuery } from "@tanstack/react-query";
import { OmbiMedia } from "@home-control/types/ombi";
import { queryClient } from "../../utils/queryClient";
import api from "../../utils/api";
import PillButton from "../PillButton";
import MediaListCard from "./MediaListCard";
import DotLoading from "../DotLoading";

function DeleteRequestButton({ item }: { item: OmbiMedia }) {
  const deleteRequest = useMutation(
    () => api(`/ombi/${item.type}/request/${item.tmdbId}`, "delete"),
    { onSuccess: () => queryClient.refetchQueries(["ombi"]) }
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
    ["ombi", "recently-requested"],
    () => api<OmbiMedia[]>("/ombi/recently-requested", "get"),
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
