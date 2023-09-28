import { makeTurnOnCall } from "../utils/hass";
import IconButtonCard from "./IconButtonCard";
import ButtonRow from "./ButtonRow";
import DialogBase from "./DialogBase";
import BaseDiv from "./BaseDiv";

export default function AndroidRemoteDialog({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <DialogBase title="Controle" onClose={onClose}>
      <BaseDiv
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "286px",
        }}
      >
        <ButtonRow height={90}>
          <IconButtonCard
            icon="mdi:image-outline"
            size={28}
            action={makeTurnOnCall("script.sala_tv_ligar_tela")}
          />
          <IconButtonCard
            repeatOnHold
            icon="mdi:chevron-up"
            size={32}
            action={makeTurnOnCall("script.sala_mibox_navegar_cima")}
          />
          <IconButtonCard
            icon="mdi:image-off-outline"
            size={28}
            action={makeTurnOnCall("script.sala_tv_desligar_tela")}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconButtonCard
            repeatOnHold
            icon="mdi:chevron-left"
            size={32}
            action={makeTurnOnCall("script.sala_mibox_navegar_esquerda")}
          />
          <IconButtonCard
            icon="mdi:record-circle-outline"
            size={25}
            action={makeTurnOnCall("script.sala_mibox_navegar_selecionar")}
          />
          <IconButtonCard
            repeatOnHold
            icon="mdi:chevron-right"
            size={32}
            action={makeTurnOnCall("script.sala_mibox_navegar_direita")}
          />
        </ButtonRow>
        <ButtonRow height={90}>
          <IconButtonCard
            icon="mdi:undo"
            size={30}
            action={makeTurnOnCall("script.sala_mibox_navegar_voltar")}
          />
          <IconButtonCard
            repeatOnHold
            icon="mdi:chevron-down"
            size={32}
            action={makeTurnOnCall("script.sala_mibox_navegar_baixo")}
          />
          <IconButtonCard
            icon="mdi:home"
            size={25}
            action={makeTurnOnCall("script.sala_mibox_navegar_home")}
          />
        </ButtonRow>
      </BaseDiv>
    </DialogBase>
  );
}
