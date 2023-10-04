import { useMutation, useQuery } from "@tanstack/react-query";
import { type Torrent } from "@home-control/types/transmission";
import { useMenu } from "../utils/useMenu";
import { usePrompt } from "../utils/usePrompt";
import api from "../utils/api";
import { queryClient } from "../utils/queryClient";
import EntityListItem from "../components/EntityListItem";
import DownloadListCard, {
  DownloadItem,
  DownloadStatus,
} from "../components/DownloadListCard";

function getStatus(torrent: Torrent): DownloadStatus {
  if (torrent.status === 4) {
    return "downloading";
  }

  if (torrent.status === 6) {
    return "seeding";
  }

  if (torrent.percentDone === 1) {
    return "completed";
  }

  if (torrent.status === 0) {
    return "stopped";
  }

  if (torrent.errorString !== "") {
    return "error";
  }

  if (torrent.status === 3) {
    return "queued";
  }

  if (torrent.status === 1 || torrent.status === 2) {
    return "verifying";
  }

  return "error";
}

function parseTorrent(torrent: Torrent): DownloadItem {
  const status = getStatus(torrent);

  return {
    id: String(torrent.id),
    name: torrent.name,
    eta: torrent.eta > 0 ? torrent.eta : null,
    status,
    active: !["stopped", "error", "completed"].includes(status),
    completed: status === "completed",
    percentDone: torrent.percentDone * 100,
  };
}

function useTorrentMutation() {
  const { mutate } = useMutation((func: () => Promise<any>) =>
    func().then(() => queryClient.refetchQueries(["torrents"]))
  );

  return mutate;
}

export function useAddTorrent() {
  const mutate = useTorrentMutation();
  const prompt = usePrompt();

  return function addTorrent() {
    prompt({
      title: "Adicionar",
      fields: ["Magnet URI"],
      onConfirm: ([magnet]) => {
        mutate(() => api("/transmission/add", "post", { magnet }));
      },
    });
  };
}

export default function Torrents() {
  const showMenu = useMenu();
  const mutate = useTorrentMutation();

  const { data = [], isInitialLoading } = useQuery(
    ["torrents"],
    () => {
      return api<Torrent[]>("/transmission/torrents", "get").then((res) =>
        res.map(parseTorrent)
      );
    },
    { refetchInterval: 2_000 }
  );

  function onItemClick(torrent: DownloadItem) {
    showMenu({
      title: "Opções",
      options: [
        torrent.active
          ? { value: "stop", label: "Pausar" }
          : { value: "start", label: "Continuar" },
        { value: "remove_without_data", label: "Remover Torrent" },
        { value: "remove_with_data", label: "Remover Torrent e Arquivos" },
      ],
      onSelect: (value) => {
        const action = value.startsWith("remove") ? "remove" : value;

        mutate(() =>
          api(`/transmission/${action}`, "post", {
            ids: [torrent.id],
            ...(action === "remove"
              ? { deleteData: value === "remove_with_data" }
              : {}),
          })
        );
      },
    });
  }

  return (
    <DownloadListCard
      downloads={data}
      loading={isInitialLoading}
      onItemClick={onItemClick}
    >
      <EntityListItem
        sx={{ py: "16px", mb: "-8px" }}
        entityId="switch.transmission_turtle_mode"
      />
    </DownloadListCard>
  );
}
