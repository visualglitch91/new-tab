import { Button, List, Stack } from "@mui/material";
import {
  callService,
  makeServiceCall,
  makeTurnOnCall,
  useEntity,
} from "$client/utils/hass";
import useModal from "$client/utils/useModal";
import { formatNumericValue } from "$client/utils/general";
import EntityButton from "../EntityButton";
import MediaCard from "../MediaCard";
import AutoGrid from "../AutoGrid";
import IconHugeButton from "../IconHugeButton";
import BaseEntityButton from "../BaseEntityButton";
import AndroidRemoteDialog from "../AndroidRemoteDialog";
import { ScriptImageButtonCard, parseSourceName } from "./utils";
import ButtonRow from "../ButtonRow";
import GlossyPaper from "../GlossyPaper";
import ListItem from "../ListItem";
import AltIconButton from "../AltIconButton";
import Icon from "../Icon";
import { useMenu } from "$client/utils/useMenu";
import useMountEffect from "$client/utils/useMountEffect";

function spacer(height?: number) {
  return <div style={{ height: height && `${height}px` }} />;
}

function AndroidRemoteButton() {
  const mount = useModal();

  function showRemote() {
    mount((_, props) => <AndroidRemoteDialog {...props} />);
  }

  return (
    <BaseEntityButton icon="remote" label="Controle" onClick={showRemote} />
  );
}

export default function TV({ noMediCard }: { noMediCard?: boolean }) {
  return (
    <Stack spacing={2}>
      {!noMediCard && (
        <>
          <MediaCard />
          {spacer(12)}
        </>
      )}

      <ButtonRow>
        <EntityButton entityId="media_player.sala_tv" changeTimeout={30_000} />
        <EntityButton entityId="switch.sala_ambilight" changeTimeout={30_000} />
        <EntityButton entityId="switch.sala_ledfx" changeTimeout={30_000} />
        <AndroidRemoteButton />
      </ButtonRow>

      {spacer(12)}

      <AutoGrid gap={12} columnWidth={120} rowHeight={70}>
        <ScriptImageButtonCard
          asset="globo"
          script="sala_mibox_globoplay_ao_vivo"
        />
        <ScriptImageButtonCard
          asset="globoplay"
          script="sala_mibox_globoplay"
        />
        <ScriptImageButtonCard asset="jellyfin" script="sala_mibox_jellyfin" />
        <ScriptImageButtonCard
          asset="disneyplus"
          script="sala_mibox_disney_plus"
        />
        <ScriptImageButtonCard asset="hbomax" script="sala_mibox_hbo_max" />
        <ScriptImageButtonCard asset="starplus" script="sala_mibox_star_plus" />
        <ScriptImageButtonCard
          asset="prime_video"
          script="sala_mibox_prime_video"
        />
        <ScriptImageButtonCard asset="spotify" script="sala_mibox_spotify" />
        <ScriptImageButtonCard
          asset="crunchyroll"
          script="sala_mibox_crunchyroll"
        />
        <ScriptImageButtonCard asset="youtube" script="sala_mibox_youtube" />
        <ScriptImageButtonCard asset="twitch" script="sala_mibox_twitch" />
        <ScriptImageButtonCard asset="switch" script="sala_tv_switch" />
        <ScriptImageButtonCard asset="ps5" script="sala_tv_playstation_5" />

        <IconHugeButton
          icon="mdi:information-outline"
          size={40}
          action={makeTurnOnCall("script.sala_receiver_info")}
        />
      </AutoGrid>

      <List component={GlossyPaper} dense>
        <SpotifySource />
        {[
          ["media_player.sala_tv", "Volume Sala"],
          ["media_player.escritorio_echo", "Volume Escritório"],
          ["media_player.cozinha_echo", "Volume Cozinha"],
          ["media_player.quarto_echo", "Volume Quarto"],
          ["media_player.banheiro_echo", "Volume Banheiro"],
        ].map(([id, label]) => (
          <VolumeControlListItem key={id} label={label} entityId={id} />
        ))}
      </List>
    </Stack>
  );
}

function SpotifySource() {
  const entityId = "media_player.spotify_visualglitch91";
  const showMenu = useMenu();
  const { source, source_list: sourceList = [] } =
    useEntity(entityId)?.attributes || {};

  if (!source) {
    return null;
  }

  return (
    <ListItem
      primaryText="Tocando em"
      startSlot={<Icon icon="mdi:spotify" />}
      endSlot={
        <Button
          size="small"
          onClick={(e) => {
            showMenu({
              mouseEvent: e.nativeEvent,
              clickAnchor: true,
              title: "Opções",
              options: sourceList.map((source: string) => ({
                label: parseSourceName(source),
                onClick: makeServiceCall("media_player", "select_source", {
                  entity_id: entityId,
                  source,
                }),
              })),
            });
          }}
        >
          {parseSourceName(source)}
        </Button>
      }
    />
  );
}

function VolumeControlListItem({
  entityId,
  label,
}: {
  entityId: string;
  label: string;
}) {
  const entity = useEntity(entityId);
  const volume = entity?.attributes.volume_level;

  useMountEffect(() => {
    if (typeof volume === "undefined") {
      callService("media_player", "volume_set", {
        volume_level: 0.5,
        entity_id: entityId,
      });
    }
  });

  return (
    <ListItem
      primaryText={label || entity?.attributes.friendly_name || entityId}
      secondaryText={
        typeof volume === "undefined"
          ? undefined
          : formatNumericValue(volume * 100, "%", 0)
      }
      startSlot={<Icon icon="mdi:volume-high" />}
      endSlot={
        <Stack direction="row" alignItems="center" gap={1}>
          <AltIconButton
            icon="mdi:minus"
            size={24}
            onClick={makeServiceCall("media_player", "volume_down", {
              entity_id: entityId,
            })}
          />
          <AltIconButton
            icon="mdi:plus"
            size={24}
            onClick={makeServiceCall("media_player", "volume_up", {
              entity_id: entityId,
            })}
          />
        </Stack>
      }
    />
  );
}
