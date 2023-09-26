import { useMutation, useQuery } from "@tanstack/react-query";
import { LinearProgress, Tooltip, styled } from "@mui/joy";
import { type Torrent } from "../../types/transmission";
import PillButton from "../components/PillButton";
import Stack from "../components/Stack";
import Icon from "../components/Icon";
import FlexRow from "../components/FlexRow";
import { useMenu } from "../utils/useMenu";
import { usePrompt } from "../utils/usePrompt";
import api from "../utils/api";
import { queryClient } from "../utils/queryClient";
import { formatNumericValue, useResponsive } from "../utils/general";
import ListCard from "../components/ListCard";
import EntityListItem from "../components/EntityListItem";
import RippleButton from "../components/RippleButton";
import { alpha } from "../utils/styles";

const ItemCard = styled(RippleButton)(({ theme }) => ({
  padding: 16,
  width: "100%",
  justifyContent: "stretch",
  textAlign: "left",
  background: "transparent",
  border: "none",
  borderTop: `1px solid ${alpha(theme.palette.primary[400], 0.3)}`,
  "&:hover": { backgroundColor: alpha(theme.palette.neutral[800], 0.3) },
}));

const ItemContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: "8px",
  width: "100%",
  alignItems: "flex-start",
  overflow: "hidden",
});

const Header = styled(FlexRow)({
  width: "100%",
  overflow: "hidden",
});

const Name = styled("span")({
  flex: 1,
  fontSize: "14px",
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const Details = styled(FlexRow)({
  opacity: 0.8,
  fontSize: "12px",
  fontWeight: 600,
});

const STATUS_LABELS = {
  downloading: "Baixando",
  seeding: "Subindo",
  completed: "Completo",
  stopped: "Parado",
  error: "Erro",
  queued: "Na Fila",
  verifying: "Verificando",
};

function getStatus(torrent: Torrent): keyof typeof STATUS_LABELS {
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

function parseTorrent(torrent: Torrent) {
  const status = getStatus(torrent);

  return {
    id: torrent.id,
    name: torrent.name,
    eta: torrent.eta > 0 ? torrent.eta : null,
    status,
    active: !["stopped", "error", "completed"].includes(status),
    completed: status === "completed",
    percentDone: torrent.percentDone * 100,
  };
}

type ParsedTorrent = ReturnType<typeof parseTorrent>;

function Torrents() {
  const { isMobile } = useResponsive();
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

  function add() {
    prompt({
      title: "Adicionar",
      fields: ["Magnet URI"],
      onConfirm: ([magnet]) => {
        mutate(() => api("/transmission/add", "post", { magnet }));
      },
    });
  }

  function onClick(torrent: ParsedTorrent) {
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
    <Stack>
      {menu}
      {modals}
      <ListCard
        gap={0}
        title="Torrents"
        titleAction={<PillButton icon="mdi:plus" onClick={add} />}
      >
        <EntityListItem
          sx={{ py: "16px" }}
          entityId="switch.transmission_turtle_mode"
        />
        {data.map((it) => (
          <Tooltip key={it.id} title={it.name}>
            <ItemCard onClick={() => onClick(it)}>
              <ItemContent>
                <Header>
                  <Icon
                    size={16}
                    icon={
                      it.completed
                        ? "mdi-check"
                        : it.status === "seeding"
                        ? "mdi-arrow-up"
                        : it.active
                        ? "mdi-arrow-down"
                        : "mdi-pause"
                    }
                  />
                  <Name>{it.name}</Name>
                </Header>
                <LinearProgress
                  determinate
                  variant="outlined"
                  thickness={isMobile ? 6 : 7}
                  value={it.percentDone}
                  sx={{ width: "100%" }}
                />
                <Details>
                  <span>{STATUS_LABELS[it.status]}</span>
                  <span>{formatNumericValue(it.percentDone, "%", 0)}</span>
                  <span>{it.eta}</span>
                </Details>
              </ItemContent>
            </ItemCard>
          </Tooltip>
        ))}
      </ListCard>
    </Stack>
  );
}

const torrentsModule = <Torrents />;

export default torrentsModule;
