import { Box } from "@mui/material";
import { makeTurnOnCall } from "$client/utils/hass";
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
            action={makeTurnOnCall("button.sala_tv_ligar_tela")}
          />
          <IconHugeButton
            icon="mdi:chevron-up"
            size={32}
            action={makeTurnOnCall("button.sala_tvbox_navegar_cima")}
          />
          <IconHugeButton
            icon="mdi:image-off-outline"
            size={28}
            action={makeTurnOnCall("button.sala_tv_desligar_tela")}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:chevron-left"
            size={32}
            action={makeTurnOnCall("button.sala_tvbox_navegar_esquerda")}
          />
          <IconHugeButton
            icon="mdi:record-circle-outline"
            size={25}
            action={makeTurnOnCall("button.sala_tvbox_navegar_selecionar")}
          />
          <IconHugeButton
            icon="mdi:chevron-right"
            size={32}
            action={makeTurnOnCall("button.sala_tvbox_navegar_direita")}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:undo"
            size={30}
            action={makeTurnOnCall("button.sala_tvbox_navegar_voltar")}
          />
          <IconHugeButton
            icon="mdi:chevron-down"
            size={32}
            action={makeTurnOnCall("button.sala_tvbox_navegar_baixo")}
          />
          <IconHugeButton
            icon="mdi:home"
            size={25}
            action={makeTurnOnCall("button.sala_tvbox_navegar_home")}
          />
        </ButtonRow>
      </Box>
    </DialogBase>
  );
}
