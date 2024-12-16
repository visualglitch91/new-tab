import { Box } from "@mui/material";
import { makeTurnOnCall } from "$app/utils/hass";
import IconHugeButton from "./IconHugeButton";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
import ButtonRow from "./ButtonRow";

export default function AndroidRemoteDialog(props: DialogBaseControlProps) {
  return (
    <DialogBase {...props} bottomMobileSheet title="Controle">
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "286px",
          "& button": {
            background: theme.palette.white.main,
            color: theme.palette.white.contrastText,
            "&:hover": {
              background: theme.palette.white.dark,
            },
          },
        })}
      >
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:image-outline"
            size={28}
            action={makeTurnOnCall("button.sala_media_player_ligar_tela")}
          />
          <IconHugeButton
            icon="mdi:chevron-up"
            size={32}
            action={makeTurnOnCall("button.sala_media_player_move_up")}
          />
          <IconHugeButton
            icon="mdi:image-off-outline"
            size={28}
            action={makeTurnOnCall("button.sala_media_player_desligar_tela")}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:chevron-left"
            size={32}
            action={makeTurnOnCall("button.sala_media_player_move_left")}
          />
          <IconHugeButton
            icon="mdi:record-circle-outline"
            size={25}
            action={makeTurnOnCall("button.sala_media_player_select")}
          />
          <IconHugeButton
            icon="mdi:chevron-right"
            size={32}
            action={makeTurnOnCall("button.sala_media_player_move_right")}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:undo"
            size={30}
            action={makeTurnOnCall("button.sala_media_player_back")}
          />
          <IconHugeButton
            icon="mdi:chevron-down"
            size={32}
            action={makeTurnOnCall("button.sala_media_player_move_down")}
          />
          <IconHugeButton
            icon="mdi:home"
            size={25}
            action={makeTurnOnCall("button.sala_media_player_home")}
          />
        </ButtonRow>
      </Box>
    </DialogBase>
  );
}
