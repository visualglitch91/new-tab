import { makeTurnOnCall } from "../utils/hass";
import Stack from "../components/Stack";
import ButtonRow from "../components/ButtonRow";
import TitleCard from "../components/TitleCard";
import EntityButton from "../components/EntityButton";
import { TVEntitySwitch } from "../components/TVEntitySwitch";
import { IconButtonCard, ScriptImageButtonCard } from "./tv.utils";
import Grid from "../components/Grid";

function spacer(height?: number) {
  return <div style={{ height: height && `${height}px` }} />;
}

export default (
  <Stack smallGap>
    <TitleCard title="TV" action={<TVEntitySwitch />} />

    {spacer()}

    <ButtonRow height={70}>
      <IconButtonCard
        icon="mdi:image-outline"
        size={28}
        action={makeTurnOnCall("script.sala_tv_ligar_tela")}
      />
      <IconButtonCard
        repeatOnHold
        icon="mdi:chevron-up"
        size={32}
        action={makeTurnOnCall("script.sala_tv_navegar_cima")}
      />
      <IconButtonCard
        icon="mdi:image-off-outline"
        size={28}
        action={makeTurnOnCall("script.sala_tv_desligar_tela")}
      />
    </ButtonRow>
    <ButtonRow height={70}>
      <IconButtonCard
        repeatOnHold
        icon="mdi:chevron-left"
        size={32}
        action={makeTurnOnCall("script.sala_tv_navegar_esquerda")}
      />
      <IconButtonCard
        icon="mdi:record-circle-outline"
        size={25}
        action={makeTurnOnCall("script.sala_tv_selecionar")}
      />
      <IconButtonCard
        repeatOnHold
        icon="mdi:chevron-right"
        size={32}
        action={makeTurnOnCall("script.sala_tv_navegar_direita")}
      />
    </ButtonRow>
    <ButtonRow height={70}>
      <IconButtonCard
        icon="mdi:undo"
        size={30}
        action={makeTurnOnCall("script.sala_tv_voltar")}
      />
      <IconButtonCard
        repeatOnHold
        icon="mdi:chevron-down"
        size={32}
        action={makeTurnOnCall("script.sala_tv_navegar_baixo")}
      />
      <IconButtonCard
        icon="mdi:home"
        size={25}
        action={makeTurnOnCall("script.sala_tv_navegar_home")}
      />
    </ButtonRow>

    {spacer(12)}

    <ButtonRow height={55}>
      <IconButtonCard
        repeatOnHold
        icon="mdi:volume-minus"
        size={25}
        action={makeTurnOnCall("script.sala_volume_menos")}
      />
      <IconButtonCard
        icon="mdi:volume-off"
        size={25}
        action={makeTurnOnCall("script.sala_volume_mute")}
      />
      <IconButtonCard
        repeatOnHold
        icon="mdi:volume-plus"
        size={25}
        action={makeTurnOnCall("script.sala_volume_mais")}
      />
    </ButtonRow>
    <ButtonRow height={55}>
      <IconButtonCard
        repeatOnHold
        icon="mdi:rewind"
        size={25}
        action={makeTurnOnCall("script.sala_tv_rewind")}
      />
      <IconButtonCard
        icon="mdi:play"
        size={25}
        action={makeTurnOnCall("script.sala_tv_play")}
      />
      <IconButtonCard
        icon="mdi:pause"
        size={25}
        action={makeTurnOnCall("script.sala_tv_pause")}
      />
      <IconButtonCard
        repeatOnHold
        icon="mdi:fast-forward"
        size={25}
        action={makeTurnOnCall("script.sala_tv_fast_forward")}
      />
    </ButtonRow>

    {spacer(12)}

    <ButtonRow>
      <EntityButton
        label="Surround"
        icon="mdi:surround-sound"
        entityId="switch.sala_receiver"
        changeTimeout={30_000}
      />
      <EntityButton
        icon="mdi-television-ambient-light"
        label="RGB"
        entityId="light.sala_rgb"
      />
      <EntityButton entityId="switch.sala_ambilight" changeTimeout={30_000} />
    </ButtonRow>

    {spacer(12)}

    <Grid gap={12} columnWidth={120} rowHeight={70}>
      <ScriptImageButtonCard asset="globo" script="sala_tv_globo" />
      <ScriptImageButtonCard asset="globoplay" script="sala_tv_globoplay" />
      <ScriptImageButtonCard asset="plex" script="sala_tv_plex" />
      <ScriptImageButtonCard asset="disneyplus" script="sala_tv_disney_plus" />
      <ScriptImageButtonCard asset="hbomax" script="sala_tv_hbo_max" />
      <ScriptImageButtonCard asset="starplus" script="sala_tv_star_plus" />
      <ScriptImageButtonCard asset="prime_video" script="sala_tv_prime_video" />
      <ScriptImageButtonCard asset="spotify" script="sala_tv_spotify" />
      <ScriptImageButtonCard asset="crunchyroll" script="sala_tv_crunchyroll" />
      <ScriptImageButtonCard asset="youtube" script="sala_tv_youtube" />
      <ScriptImageButtonCard asset="kodi" script="sala_tv_kodi" />
      <ScriptImageButtonCard
        asset="discovery_plus"
        script="sala_tv_discovery"
      />
      <ScriptImageButtonCard asset="twitch" script="sala_tv_twitch" />
      <ScriptImageButtonCard asset="switch" script="sala_tv_switch" />
      <ScriptImageButtonCard asset="ps5" script="sala_tv_playstation_5" />
    </Grid>
  </Stack>
);
