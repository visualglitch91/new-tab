import { makeTurnOnCall } from "../utils/hass";
import Stack from "../components/Stack";
import ButtonRow from "../components/ButtonRow";
import TitleCard from "../components/TitleCard";
import EntityButton from "../components/EntityButton";
import { TVEntitySwitch } from "../components/TVEntitySwitch";
import {
  IconButtonCard,
  makeTVButtonCall,
  makeTVMediaControlCall,
  ScriptImageButtonCard,
} from "./tv.utils";
import LightGroupEntityButton from "../components/LightGroupEntityButton";

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
        action={makeTVButtonCall("UP")}
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
        action={makeTVButtonCall("LEFT")}
      />
      <IconButtonCard
        icon="mdi:record-circle-outline"
        size={25}
        action={makeTVButtonCall("ENTER")}
      />
      <IconButtonCard
        repeatOnHold
        icon="mdi:chevron-right"
        size={32}
        action={makeTVButtonCall("RIGHT")}
      />
    </ButtonRow>
    <ButtonRow height={70}>
      <IconButtonCard
        icon="mdi:undo"
        size={30}
        action={makeTVButtonCall("BACK")}
      />
      <IconButtonCard
        repeatOnHold
        icon="mdi:chevron-down"
        size={32}
        action={makeTVButtonCall("DOWN")}
      />
      <IconButtonCard
        icon="mdi:cog"
        size={25}
        action={makeTVButtonCall("MENU")}
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
        action={makeTVMediaControlCall("rewind")}
      />
      <IconButtonCard
        icon="mdi:play"
        size={25}
        action={makeTVMediaControlCall("play")}
      />
      <IconButtonCard
        icon="mdi:pause"
        size={25}
        action={makeTVMediaControlCall("pause")}
      />
      <IconButtonCard
        repeatOnHold
        icon="mdi:fast-forward"
        size={25}
        action={makeTVMediaControlCall("fastForward")}
      />
    </ButtonRow>

    {spacer(12)}

    <ButtonRow>
      <EntityButton
        label="Surround"
        icon="mdi:surround-sound"
        changeTimeout={30_000}
        entityId="switch.sala_receiver"
      />
      <LightGroupEntityButton
        icon="mdi-television-ambient-light"
        label="RGB"
        entityIds={[
          "light.sala_rgb_tv",
          "light.sala_rgb_rack",
          "light.sala_rgb_sofa",
        ]}
      />
    </ButtonRow>

    {spacer(12)}

    <ButtonRow height={70}>
      <ScriptImageButtonCard asset="globo" script="sala_tv_globo" />
      <ScriptImageButtonCard asset="globoplay" script="sala_tv_globoplay" />
      <ScriptImageButtonCard asset="netflix" script="sala_tv_netflix" />
    </ButtonRow>

    <ButtonRow height={70}>
      <ScriptImageButtonCard asset="plex" script="sala_tv_plex" />
      <ScriptImageButtonCard asset="disneyplus" script="sala_tv_disney_plus" />
      <ScriptImageButtonCard asset="hbomax" script="sala_tv_hbo_max" />
    </ButtonRow>

    <ButtonRow height={70}>
      <ScriptImageButtonCard asset="starplus" script="sala_tv_star_plus" />
      <ScriptImageButtonCard asset="prime_video" script="sala_tv_prime_video" />
      <ScriptImageButtonCard asset="spotify" script="sala_tv_spotify" />
    </ButtonRow>

    <ButtonRow height={70}>
      <ScriptImageButtonCard asset="fire_tv" script="sala_tv_firetv" />
      <ScriptImageButtonCard asset="ps5" script="sala_tv_playstation_5" />
      <ScriptImageButtonCard asset="switch" script="sala_tv_switch" />
    </ButtonRow>
  </Stack>
);
