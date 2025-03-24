import { capitalize } from "lodash";
import { callService, makeServiceCall, useEntity } from "$app/utils/hass";
import { Stack, styled } from "@mui/material";
import { useMenu } from "$app/utils/useMenu";
import useModal from "$app/utils/useModal";
import { stopClickPropagation } from "$app/utils/general";
import BaseTileCard from "./BaseTileCard";
import { useCurrentMedia } from "./MediaCard/utils";
import AltIconButton from "./AltIconButton";
import AndroidRemoteDialog from "./AndroidRemoteDialog";

const MediaImg = styled("img")(({ theme }) => ({
  "--size": "68px",
  height: "var(--size)",
  width: "var(--size)",
  borderRadius: theme.shape.borderRadius,
  objectFit: "cover",
  objectPosition: "center center",
}));

const Label = styled("span")(({ theme }) => ({
  ...theme.typography.body2,
  lineHeight: 1,
}));

const Details = styled("span")(({ theme }) => ({
  ...theme.typography.caption,
  lineHeight: 1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  marginBottom: 4,
}));

export default function TVTileCard({ entityId }: { entityId: string }) {
  const mount = useModal();
  const showMenu = useMenu();
  const currentMedia = useCurrentMedia();
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
    if (source === "Globo ao Vivo") {
      callService("button", "press", {
        entity_id: "button.sala_media_player_globo_ao_vivo",
      });
    } else {
      callService("media_player", "select_source", {
        entity_id: entityId,
        source,
      });
    }
  };

  const controls = (
    <Stack
      gap={1}
      direction="row"
      alignItems="center"
      width="fit-content"
      {...stopClickPropagation()}
    >
      {currentMedia?.hideControls ? null : (
        <>
          <AltIconButton
            icon="gamepad"
            size={24}
            onClick={() => {
              mount((_, props) => <AndroidRemoteDialog {...props} />);
            }}
          />
          <AltIconButton
            icon="play-pause"
            size={24}
            onClick={makeServiceCall("media_player", "media_play_pause", {
              entity_id: entityId,
            })}
          />
        </>
      )}
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

  const details =
    [currentMedia?.spotify ? currentMedia?.artist : null, currentMedia?.title]
      .filter(Boolean)
      .join(" - ") || attributes?.source;

  return (
    <BaseTileCard
      active
      disableIconBackground={!!currentMedia?.image}
      icon={
        currentMedia?.image ? <MediaImg src={currentMedia.image} /> : "monitor"
      }
      primaryText={
        <Stack gap={0.5} ml={0.5} py={0.8}>
          <Label>Televisão</Label>
          {details && <Details>{details}</Details>}
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
