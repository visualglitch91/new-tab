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

export default function Torrents() {
  const { data = [] } = useQuery(
    ["torrents"],
    () => {
      return api<Torrent[]>("/transmission/torrents", "get").then((res) =>
        res.map(parseTorrent)
      );
    },
    { refetchInterval: 2_000 }
  );

  const { mutate } = useMutation((func: () => Promise<any>) =>
    func().then(() => queryClient.refetchQueries(["torrents"]))
  );

  const [showMenu, menu] = useMenu();
  const [prompt, modals] = usePrompt();

  function onAdd() {
    prompt({
      title: "Adicionar",
      fields: ["Magnet URI"],
      onConfirm: ([magnet]) => {
        mutate(() => api("/transmission/add", "post", { magnet }));
      },
    });
  }

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
    <>
      {menu}
      {modals}
      <DownloadListCard
        title="Torrents"
        downloads={data}
        onAdd={onAdd}
        onItemClick={onItemClick}
      >
        <EntityListItem
          sx={{ py: "16px" }}
          entityId="switch.transmission_turtle_mode"
        />
      </DownloadListCard>
    </>
  );
}
