import { capitalize } from "lodash";
import { callService, makeServiceCall, useEntity } from "$app/utils/hass";
import { Stack, styled } from "@mui/material";
import { useMenu } from "$app/utils/useMenu";
import useModal from "$app/utils/useModal";
import { stopClickPropagation } from "$app/utils/general";
import BaseTileCard from "./BaseTileCard";
import AltIconButton from "./AltIconButton";
import AndroidRemoteDialog from "./AndroidRemoteDialog";

const Label = styled("span")(({ theme }) => ({
  ...theme.typography.body2,
  lineHeight: 1,
}));

export default function TVTileCard({
  entityId,
  remoteId,
}: {
  entityId: string;
  remoteId: string;
}) {
  const mount = useModal();
  const showMenu = useMenu();
  const { state, attributes } = useEntity(entityId) || {};
  const isMuted = attributes?.is_volume_muted;
  const isOn = Boolean(
    state && !["off", "unknown", "unavailable"].includes(state)
  );

  if (!isOn) {
    return (
      <BaseTileCard
        icon="monitor"
        primaryText="Televisão"
        onClick={makeServiceCall("media_player", "turn_on", {
          entity_id: entityId,
        })}
      />
    );
  }

  const onSourceChange = (source: string) => {
    callService("media_player", "select_source", {
      entity_id: entityId,
      source,
    });
  };

  const controls = (
    <Stack
      gap={1}
      direction="row"
      alignItems="center"
      width="fit-content"
      {...stopClickPropagation()}
    >
      <AltIconButton
        icon="gamepad"
        size={24}
        onClick={() => {
          mount((_, props) => (
            <AndroidRemoteDialog {...props} entityId={remoteId} />
          ));
        }}
      />
      <AltIconButton
        icon="play-pause"
        size={24}
        onClick={makeServiceCall("media_player", "media_play_pause", {
          entity_id: entityId,
        })}
      />
      <AltIconButton
        icon="volume-minus"
        size={24}
        onClick={makeServiceCall("media_player", "volume_down", {
          entity_id: entityId,
        })}
      />
      <AltIconButton
        icon="volume-off"
        size={24}
        onClick={makeServiceCall("media_player", "volume_mute", {
          entity_id: entityId,
          is_volume_muted: typeof isMuted === "boolean" ? !isMuted : true,
        })}
      />
      <AltIconButton
        icon="volume-plus"
        size={24}
        onClick={makeServiceCall("media_player", "volume_up", {
          entity_id: entityId,
        })}
      />
      <AltIconButton
        icon="power"
        size={24}
        onClick={makeServiceCall("media_player", "turn_off", {
          entity_id: entityId,
        })}
      />
    </Stack>
  );

  return (
    <BaseTileCard
      active
      icon="monitor"
      primaryText={
        <Stack gap={0.5} ml={0.5} py={0.8}>
          <Label>Televisão</Label>
          {controls}
        </Stack>
      }
      onClick={(e) => {
        showMenu({
          mouseEvent: e.nativeEvent,
          clickAnchor: true,
          title: "Canais",
          options: (attributes?.source_list || [])
            .filter((it) => it !== "Noop")
            .map((value: string) => {
              return {
                label: value.split(" ").map(capitalize).join(" "),
                onClick: () => onSourceChange(value),
              };
            }),
        });
      }}
    />
  );
}
