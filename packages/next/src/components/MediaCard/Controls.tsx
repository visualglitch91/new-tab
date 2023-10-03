import { styled, ButtonBase, SxProps } from "@mui/material";
import { callService, makeServiceCall, makeTurnOnCall } from "../../utils/hass";
import Icon from "../Icon";

const Root = styled("div")({
  display: "flex",
  gap: 10,
});

const ControlRoot = styled(ButtonBase)({
  color: "white",
  border: "1px solid white",
  background: "transparent",
  outline: "none",
  borderRadius: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  flexGrow: 0,
  flexShrink: 0,
  "&:hover": { background: "rgba(50,50,50,0.2)" },
});

function Control({
  icon,
  sx,
  //  onLongPress,
  onClick,
}: {
  icon: string;
  sx?: SxProps;
  onClick: () => void;
  onLongPress?: () => void;
}) {
  return (
    <ControlRoot sx={sx} onClick={onClick} /*onLongPress={onLongPress}*/>
      <Icon icon={icon} size={17} />
    </ControlRoot>
  );
}

function makeSpotifyCall(service: string) {
  const entityId = "media_player.spotify_visualglitch91";

  return () => {
    callService("media_player", `media_${service}`, {
      entity_id: entityId,
    });

    setTimeout(() => {
      callService("homeassistant", "update_entity", {
        entity_id: entityId,
      });
    }, 1000);
  };
}

export default function Controls({
  isSpotify,
  volumeOnly,
}: {
  isSpotify?: boolean;
  volumeOnly?: boolean;
}) {
  return (
    <Root>
      <Control
        icon="volume-minus"
        onClick={makeServiceCall("media_player", "volume_down", {
          entity_id: "media_player.sala_tv",
        })}
      />
      <Control
        icon="volume-off"
        onClick={makeTurnOnCall("script.sala_volume_mute_unmute")}
      />
      <Control
        icon="volume-plus"
        onClick={makeServiceCall("media_player", "volume_up", {
          entity_id: "media_player.sala_tv",
        })}
      />
      {!volumeOnly && (
        <>
          <Control
            sx={{ marginLeft: isSpotify ? "auto" : 0 }}
            icon="skip-previous"
            onClick={
              isSpotify
                ? makeSpotifyCall("previous_track")
                : makeTurnOnCall("script.sala_mibox_rewind")
            }
          />
          <Control
            icon="play-pause"
            onClick={makeTurnOnCall("script.sala_mibox_play_pause")}
            onLongPress={makeTurnOnCall("script.sala_mibox_play")}
          />
          <Control
            icon="skip-next"
            onClick={
              isSpotify
                ? makeSpotifyCall("next_track")
                : makeTurnOnCall("script.sala_mibox_fast_forward")
            }
          />
        </>
      )}
    </Root>
  );
}
