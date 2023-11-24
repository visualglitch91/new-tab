import { useQuery } from "@tanstack/react-query";
import { useMenu } from "../utils/useMenu";
import { usePrompt } from "../utils/usePrompt";
import api from "../utils/api";
import { queryClient, useGenericMutation } from "../utils/queryClient";
import EntityListItem from "./EntityListItem";
import DownloadListCard, { DownloadItem } from "./DownloadListCard";
import { JDownloaderItem } from "@home-control/types/jdownloader";
import { useEntity } from "../utils/hass";

function parseItem(item: JDownloaderItem): DownloadItem {
  return {
    id: String(item.uuid),
    name: item.name,
    eta:
      item.finished || item.speed <= 0
        ? null
        : ((item.bytesTotal - item.bytesLoaded) / item.speed) * 1000,
    status: item.finished ? "completed" : "downloading",
    active: !item.finished,
    completed: item.finished,
    percentDone: (item.bytesLoaded / item.bytesTotal) * 100,
  };
}

function useDownloadMutation() {
  const { mutate } = useGenericMutation({
    onResolve: () => queryClient.refetchQueries(["torrents"]),
  });

  return mutate;
}

export function useAddDownload() {
  const prompt = usePrompt();
  const mutate = useDownloadMutation();

  return function addDownload() {
    prompt({
      title: "Adicionar",
      fields: ["Download URL"],
      onConfirm: ([url]) => {
        mutate(() => api("/jdownloader/add", "post", { url }));
      },
    });
  };
}

export default function JDownloader({ maxHeight }: { maxHeight?: number }) {
  const enabled = useEntity("switch.casa_jdownloader")?.state === "on";
  const mutate = useDownloadMutation();
  const showMenu = useMenu();

  const { data = [], isInitialLoading } = useQuery(
    ["jdownloader"],
    () => {
      return api<JDownloaderItem[]>("/jdownloader/downloads", "get").then(
        (data) => data.map(parseItem)
      );
    },
    { enabled, refetchInterval: 2_000, cacheTime: 5 * 60_000 }
  );

  function onItemClick(item: DownloadItem) {
    showMenu({
      title: "Opções",
      options: {
        remove: {
          label: "Remover download",
          action: () => {
            mutate(() =>
              api(`/jdownloader/remove`, "post", {
                ids: [item.id],
              })
            );
          },
        },
      },
    });
  }

  return (
    <>
      <DownloadListCard
        maxHeight={maxHeight}
        downloads={enabled ? data : []}
        loading={isInitialLoading}
        onItemClick={onItemClick}
      >
        <EntityListItem
          sx={{ py: "16px" }}
          changeTimeout={15_000}
          entityId="switch.casa_jdownloader"
        />
      </DownloadListCard>
    </>
  );
}
