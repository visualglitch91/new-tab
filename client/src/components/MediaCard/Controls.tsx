import { useLongPress } from "@uidotdev/usehooks";
import { styled, ButtonBase, SxProps } from "@mui/material";
import { callService, makeTurnOnCall } from "$client/utils/hass";
import useModal from "$client/utils/useModal";
import AndroidRemoteDialog from "../AndroidRemoteDialog";
import LGTVRemoteDialog from "../LGTVRemoteDialog";
import Icon from "../Icon";

const Root = styled("div")({ display: "flex", gap: 10 });

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
  onLongPress,
  onClick,
}: {
  icon: string;
  sx?: SxProps;
  onClick: () => void;
  onLongPress?: () => void;
}) {
  const buttonProps = useLongPress(onLongPress || (() => {}));

  return (
    <ControlRoot {...buttonProps} sx={sx} onClick={onClick}>
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

export default function Controls({ isSpotify }: { isSpotify?: boolean }) {
  const mount = useModal();

  return (
    <Root>
      <Control
        icon="remote"
        onClick={() => {
          mount((_, props) => <AndroidRemoteDialog {...props} />);
        }}
        onLongPress={() => {
          mount((_, props) => <LGTVRemoteDialog {...props} />);
        }}
      />
      <Control
        sx={{ marginLeft: isSpotify ? "auto" : 0 }}
        icon="skip-previous"
        onClick={
          isSpotify
            ? makeSpotifyCall("previous_track")
            : makeTurnOnCall("button.sala_tvbox_rewind")
        }
      />
      {
        <Control
          icon="play-pause"
          onClick={makeTurnOnCall("button.sala_tvbox_play_pause")}
          onLongPress={makeTurnOnCall("button.sala_tvbox_play")}
        />
      }
      <Control
        icon="skip-next"
        onClick={
          isSpotify
            ? makeSpotifyCall("next_track")
            : makeTurnOnCall("button.sala_tvbox_fast_forward")
        }
      />
    </Root>
  );
}
