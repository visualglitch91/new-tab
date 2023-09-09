import { css, styled } from "../styling";
import { callService, useEntity } from "../utils/hass";
import ButtonCard from "../components/ButtonCard";
import PillButton from "../components/PillButton";
import Stack from "../components/Stack";
import { useMemo } from "react";
import Icon from "../components/Icon";
import FlexRow from "../components/FlexRow";
import ProgressBar from "../components/ProgressBar";
import ComponentGroup from "../components/ComponentGroup";
import { useMenu } from "../utils/useMenu";
import { usePrompt } from "../utils/usePrompt";

const ItemCard = styled(
  ButtonCard,
  css`
    padding: 12px;
    justify-content: stretch;
    text-align: left;
  `
);

const ItemContent = styled(
  "div",
  css`
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    width: 100%;
    align-items: flex-start;
    overflow: hidden;
  `
);

const Header = styled(
  FlexRow,
  css`
    width: 100%;
    overflow: hidden;
  `
);

const Name = styled(
  "span",
  css`
  flex:1;
    font-size 14px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `
);

const Details = styled(
  FlexRow,
  css`
    opacity: 0.8;
    font-size 12px;
    font-weight: bold;
  `
);

type TorrentMap = Record<
  string,
  {
    added_date: number;
    eta?: string;
    id: number;
    percent_done: string;
    status: string;
  }
>;

const status = {
  stopped: "Parado",
  check_pending: "Checando",
  checking: "Checando",
  download_pending: "Baixando",
  downloading: "Baixando",
  seed_pending: "Subindo",
  seeding: "Subindo",
};

const entryId = "21886dbb4e4f9430377f46acd48e667b";

function Torrents() {
  const torrentsEntity = useEntity("sensor.transmission_total_torrents");
  const totalTorrents: TorrentMap = torrentsEntity?.attributes?.torrent_info;
  const [showMenu, menu] = useMenu();
  const [prompt, modals] = usePrompt();

  const torrents = useMemo(() => {
    if (!totalTorrents) {
      return [];
    }

    return Object.entries(totalTorrents).map(([name, entry]) => ({
      name,
      id: entry.id,
      eta: entry.eta,
      status: entry.status as keyof typeof status,
      active: entry.status !== "stopped",
      completed: entry.percent_done === "100.00",
      percentDone: Number(entry.percent_done),
    }));
  }, [totalTorrents]);

  type Torrent = (typeof torrents)[number];

  function add() {
    prompt({
      title: "Adicionar",
      fields: ["Magnet URI"],
      onConfirm: ([uri]) => {
        callService("script", "transmission_add_other", {
          magnet_uri: uri,
        });
      },
    });
  }

  function onClick(torrent: Torrent) {
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

        callService("transmission", `${action}_torrent`, {
          entry_id: entryId,
          id: torrent.id,
          delete_data: value === "remove_with_data" ? true : undefined,
        });
      },
    });
  }

  return (
    <Stack>
      {menu}
      {modals}
      <ComponentGroup
        layout="list"
        title="Torrents"
        titleAction={
          <PillButton icon="mdi:plus" label="Adicionar" onClick={add} />
        }
        items={[{ entityId: "switch.transmission_turtle_mode" }]}
      />
      {torrents?.map((it) => (
        <ItemCard key={it.id} onClick={() => onClick(it)}>
          <ItemContent>
            <Header>
              <Icon
                size={16}
                icon={
                  it.completed
                    ? "mdi-check"
                    : it.active
                    ? "mdi-arrow-down"
                    : "mdi-pause"
                }
              />
              <Name>{it.name}</Name>
            </Header>
            <ProgressBar value={it.percentDone} />
            <Details>
              <span>{status[it.status]}</span>
              <span>{`${it.percentDone}%`}</span>
              <span>{it.eta}</span>
            </Details>
          </ItemContent>
        </ItemCard>
      ))}
    </Stack>
  );
}

const torrentsModule = <Torrents />;

export default torrentsModule;
