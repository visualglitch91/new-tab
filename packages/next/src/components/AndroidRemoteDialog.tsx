import { Box } from "@mui/material";
import { makeTurnOnCall } from "../utils/hass";
import IconHugeButton from "./IconHugeButton";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
import ButtonRow from "./ButtonRow";

export default function AndroidRemoteDialog(props: DialogBaseControlProps) {
  return (
    <DialogBase {...props} title="Controle">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "286px",
        }}
      >
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:image-outline"
            size={28}
            action={makeTurnOnCall("script.sala_tv_ligar_tela")}
          />
          <IconHugeButton
            repeatOnHold
            icon="mdi:chevron-up"
            size={32}
            action={makeTurnOnCall("script.sala_mibox_navegar_cima")}
          />
          <IconHugeButton
            icon="mdi:image-off-outline"
            size={28}
            action={makeTurnOnCall("script.sala_tv_desligar_tela")}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            repeatOnHold
            icon="mdi:chevron-left"
            size={32}
            action={makeTurnOnCall("script.sala_mibox_navegar_esquerda")}
          />
          <IconHugeButton
            icon="mdi:record-circle-outline"
            size={25}
            action={makeTurnOnCall("script.sala_mibox_navegar_selecionar")}
          />
          <IconHugeButton
            repeatOnHold
            icon="mdi:chevron-right"
            size={32}
            action={makeTurnOnCall("script.sala_mibox_navegar_direita")}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconHugeButton
            icon="mdi:undo"
            size={30}
            action={makeTurnOnCall("script.sala_mibox_navegar_voltar")}
          />
          <IconHugeButton
            repeatOnHold
            icon="mdi:chevron-down"
            size={32}
            action={makeTurnOnCall("script.sala_mibox_navegar_baixo")}
          />
          <IconHugeButton
            icon="mdi:home"
            size={25}
            action={makeTurnOnCall("script.sala_mibox_navegar_home")}
          />
        </ButtonRow>
      </Box>
    </DialogBase>
  );
}
