import { makeTurnOnCall } from "../utils/hass";
import Stack from "../components/Stack";
import ButtonRow from "../components/ButtonRow";
import EntityButton from "../components/EntityButton";
import MediaCard from "../components/MediaCard";
import { IconButtonCard, ScriptImageButtonCard } from "./tv.utils";
import Grid from "../components/Grid";
import { TVEntityButton } from "../components/TVEntityButton";
import BaseEntityButton from "../components/BaseEntityButton";
import useModal from "../utils/useModal";
import DialogBase from "../components/DialogBase";
import BaseDiv from "../components/BaseDiv";

function spacer(height?: number) {
  return <div style={{ height: height && `${height}px` }} />;
}

function AndroidRemoteButton() {
  const [mount, modals] = useModal();

  function showRemote() {
    mount((unmount) => (
      <DialogBase title="Controle" onClose={unmount}>
        <BaseDiv
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "286px",
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
    ));
  }

  return (
    <>
      {modals}
      <BaseEntityButton
        icon="remote"
        label="Controle"
        onPrimaryAction={showRemote}
      />
    </>
  );
}

export default (
  <Stack smallGap>
    <MediaCard />

    {spacer(12)}

    <ButtonRow>
      <TVEntityButton />
      <EntityButton entityId="switch.sala_ambilight" changeTimeout={30_000} />
      <AndroidRemoteButton />
    </ButtonRow>

    {spacer(12)}

    <Grid gap={12} columnWidth={120} rowHeight={70}>
      <ScriptImageButtonCard asset="globo" script="sala_tv_globo" />
      <ScriptImageButtonCard asset="globoplay" script="sala_mibox_globoplay" />
      <ScriptImageButtonCard asset="plex" script="sala_mibox_plex" />
      <ScriptImageButtonCard
        asset="disneyplus"
        script="sala_mibox_disney_plus"
      />
      <ScriptImageButtonCard asset="hbomax" script="sala_mibox_hbo_max" />
      <ScriptImageButtonCard asset="starplus" script="sala_mibox_star_plus" />
      <ScriptImageButtonCard
        asset="prime_video"
        script="sala_mibox_prime_video"
      />
      <ScriptImageButtonCard asset="spotify" script="sala_mibox_spotify" />
      <ScriptImageButtonCard
        asset="crunchyroll"
        script="sala_mibox_crunchyroll"
      />
      <ScriptImageButtonCard asset="youtube" script="sala_mibox_youtube" />
      <ScriptImageButtonCard asset="kodi" script="sala_mibox_kodi" />
      {/* <ScriptImageButtonCard
        asset="discovery_plus"
        script="sala_mibox_discovery"
      /> */}
      <ScriptImageButtonCard asset="twitch" script="sala_mibox_twitch" />
      <ScriptImageButtonCard asset="switch" script="sala_tv_switch" />
      <ScriptImageButtonCard asset="ps5" script="sala_tv_playstation_5" />

      <IconButtonCard
        icon="mdi:information-outline"
        size={40}
        action={makeTurnOnCall("script.sala_receiver_info")}
      />
    </Grid>
  </Stack>
);
