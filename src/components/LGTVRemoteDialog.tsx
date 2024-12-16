import { Box } from "@mui/material";
import { makeServiceCall } from "$app/utils/hass";
import IconHugeButton from "./IconHugeButton";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
import ButtonRow from "./ButtonRow";

export default function LGTVRemoteDialog(props: DialogBaseControlProps) {
  return (
    <DialogBase {...props} bottomMobileSheet title="Controle LG TV">
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
          <div />
          <IconHugeButton
            icon="mdi:chevron-up"
            size={32}
            action={makeServiceCall("script", "ir_bridge_enviar_sinal", {
              data: "0x20DF02FD",
            })}
          />
          <div />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:chevron-left"
            size={32}
            action={makeServiceCall("script", "ir_bridge_enviar_sinal", {
              data: "0x20DFE01F",
            })}
          />
          <IconHugeButton
            icon="mdi:record-circle-outline"
            size={25}
            action={makeServiceCall("script", "ir_bridge_enviar_sinal", {
              data: "0x20DF22DD",
            })}
          />
          <IconHugeButton
            icon="mdi:chevron-right"
            size={32}
            action={makeServiceCall("script", "ir_bridge_enviar_sinal", {
              data: "0x20DF609F",
            })}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:undo"
            size={30}
            action={makeServiceCall("script", "ir_bridge_enviar_sinal", {
              data: "0x20DF14EB",
            })}
          />
          <IconHugeButton
            icon="mdi:chevron-down"
            size={32}
            action={makeServiceCall("script", "ir_bridge_enviar_sinal", {
              data: "0x20DF827D",
            })}
          />
          <IconHugeButton
            icon="mdi:cog"
            size={25}
            action={makeServiceCall("script", "ir_bridge_enviar_sinal", {
              data: "0x20DFC23D",
            })}
          />
        </ButtonRow>
      </Box>
    </DialogBase>
  );
}
