import { makeTurnOnCall } from "../utils/hass";
import Stack from "../components/Stack";
import ButtonRow from "../components/ButtonRow";
import TitleCard from "../components/TitleCard";
import EntityButton from "../components/EntityButton";
import { TVEntitySwitch } from "../components/TVEntitySwitch";
import {
  IconButtonCard,
  ImageButtonCard,
  makeTVButtonCall,
  makeTVMediaControlCall,
  makeTVLaunchAppCall,
} from "./tv.utils";
import MultiLightButton from "../components/MultiLightButton";

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
      <MultiLightButton
        icon="mdi-television-ambient-light"
        label="RGB Geral"
        entityIds={["light.sala_rgb_tv", "light.sala_rgb_rack"]}
      />
      <EntityButton label="RGB TV" entityId="light.sala_rgb_tv" />
      <EntityButton label="RGB Rack" entityId="light.sala_rgb_rack" />
    </ButtonRow>

    {spacer(12)}

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="globo"
        action={makeTurnOnCall("script.sala_tv_globo_ao_vivo")}
      />
      <ImageButtonCard
        asset="globoplay"
        action={makeTVLaunchAppCall("globoplaywebos")}
      />
      <ImageButtonCard
        asset="netflix"
        action={makeTVLaunchAppCall("netflix")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard asset="plex" action={makeTVLaunchAppCall("cdp-30")} />
      <ImageButtonCard
        asset="disneyplus"
        action={makeTVLaunchAppCall("com.disney.disneyplus-prod")}
      />
      <ImageButtonCard
        asset="hbomax"
        action={makeTVLaunchAppCall("com.hbo.hbomax")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="youtube"
        action={makeTVLaunchAppCall("youtube.leanback.v4")}
      />
      <ImageButtonCard
        asset="starplus"
        action={makeTVLaunchAppCall("com.disney.alch.prod.lrd.app")}
      />
      <ImageButtonCard
        asset="prime_video"
        action={makeTVLaunchAppCall("amazon")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="spotify"
        action={makeTVLaunchAppCall("spotify-beehive")}
      />
      <ImageButtonCard
        asset="discovery_plus"
        action={makeTVLaunchAppCall("com.discovery.dplus")}
      />
      <ImageButtonCard
        asset="fire_tv"
        action={makeTurnOnCall("script.sala_receiver_firetv")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="ps5"
        action={makeTurnOnCall("script.sala_tv_hdmi1")}
      />
      <ImageButtonCard
        asset="switch"
        action={makeTurnOnCall("script.sala_receiver_nintendo_switch")}
      />
      <ImageButtonCard
        asset="retropi"
        action={makeTurnOnCall("script.sala_receiver_pc")}
      />
    </ButtonRow>
  </Stack>
);
