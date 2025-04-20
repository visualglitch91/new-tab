import { Box } from "@mui/material";
import { makeServiceCall } from "$app/utils/hass";
import IconHugeButton from "./IconHugeButton";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
import ButtonRow from "./ButtonRow";

export default function AndroidRemoteDialog({
  entityId,
  ...props
}: DialogBaseControlProps & { entityId: string }) {
  const makeCommandCall = (command: string) => {
    return makeServiceCall("remote", "send_command", {
      entity_id: entityId,
      command,
    });
  };

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
            "&:hover": { background: theme.palette.white.dark },
          },
        })}
      >
        <ButtonRow height={90}>
          <span />
          <IconHugeButton
            icon="mdi:chevron-up"
            size={32}
            action={makeCommandCall("DPAD_UP")}
          />
          <span />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:chevron-left"
            size={32}
            action={makeCommandCall("DPAD_LEFT")}
          />
          <IconHugeButton
            icon="mdi:record-circle-outline"
            size={25}
            action={makeCommandCall("DPAD_CENTER")}
          />
          <IconHugeButton
            icon="mdi:chevron-right"
            size={32}
            action={makeCommandCall("DPAD_RIGHT")}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:undo"
            size={30}
            action={makeCommandCall("BACK")}
          />
          <IconHugeButton
            icon="mdi:chevron-down"
            size={32}
            action={makeCommandCall("DPAD_DOWN")}
          />
          <IconHugeButton
            icon="mdi:home"
            size={25}
            action={makeCommandCall("HOME")}
          />
        </ButtonRow>
      </Box>
    </DialogBase>
  );
}
