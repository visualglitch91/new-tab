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
        onClick={makeTurnOnCall("script.sala_tv_ligar_tela")}
      />
      <IconButtonCard
        icon="mdi:chevron-up"
        size={32}
        onClick={makeTVButtonCall("UP")}
      />
      <IconButtonCard
        icon="mdi:image-off-outline"
        size={28}
        onClick={makeTurnOnCall("script.sala_tv_desligar_tela")}
      />
    </ButtonRow>
    <ButtonRow height={70}>
      <IconButtonCard
        icon="mdi:chevron-left"
        size={32}
        onClick={makeTVButtonCall("LEFT")}
      />
      <IconButtonCard
        icon="mdi:record-circle-outline"
        size={25}
        onClick={makeTVButtonCall("ENTER")}
      />
      <IconButtonCard
        icon="mdi:chevron-right"
        size={32}
        onClick={makeTVButtonCall("RIGHT")}
      />
    </ButtonRow>
    <ButtonRow height={70}>
      <IconButtonCard
        icon="mdi:undo"
        size={30}
        onClick={makeTVButtonCall("BACK")}
      />
      <IconButtonCard
        icon="mdi:chevron-down"
        size={32}
        onClick={makeTVButtonCall("DOWN")}
      />
      <IconButtonCard
        icon="mdi:cog"
        size={25}
        onClick={makeTVButtonCall("MENU")}
      />
    </ButtonRow>

    {spacer(12)}

    <ButtonRow height={55}>
      <IconButtonCard
        icon="mdi:volume-minus"
        size={25}
        onClick={makeTurnOnCall("script.sala_volume_menos")}
      />
      <IconButtonCard
        icon="mdi:volume-off"
        size={25}
        onClick={makeTurnOnCall("script.sala_volume_mute")}
      />
      <IconButtonCard
        icon="mdi:volume-plus"
        size={25}
        onClick={makeTurnOnCall("script.sala_volume_mais")}
      />
    </ButtonRow>
    <ButtonRow height={55}>
      <IconButtonCard
        icon="mdi:rewind"
        size={25}
        onClick={makeTVMediaControlCall("rewind")}
      />
      <IconButtonCard
        icon="mdi:play"
        size={25}
        onClick={makeTVMediaControlCall("play")}
      />
      <IconButtonCard
        icon="mdi:pause"
        size={25}
        onClick={makeTVMediaControlCall("pause")}
      />
      <IconButtonCard
        icon="mdi:fast-forward"
        size={25}
        onClick={makeTVMediaControlCall("fastForward")}
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
      <EntityButton label="RGB TV" entityId="light.sala_rgb_tv" />
      <EntityButton label="RGB Rack" entityId="light.sala_rgb_rack" />
    </ButtonRow>

    {spacer(12)}

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="globo"
        onClick={makeTurnOnCall("script.sala_tv_globo_ao_vivo")}
      />
      <ImageButtonCard
        asset="globoplay"
        onClick={makeTVLaunchAppCall("globoplaywebos")}
      />
      <ImageButtonCard
        asset="netflix"
        onClick={makeTVLaunchAppCall("netflix")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard asset="plex" onClick={makeTVLaunchAppCall("cdp-30")} />
      <ImageButtonCard
        asset="disneyplus"
        onClick={makeTVLaunchAppCall("com.disney.disneyplus-prod")}
      />
      <ImageButtonCard
        asset="hbomax"
        onClick={makeTVLaunchAppCall("com.hbo.hbomax")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="youtube"
        onClick={makeTVLaunchAppCall("youtube.leanback.v4")}
      />
      <ImageButtonCard
        asset="starplus"
        onClick={makeTVLaunchAppCall("com.disney.alch.prod.lrd.app")}
      />
      <ImageButtonCard
        asset="prime_video"
        onClick={makeTVLaunchAppCall("amazon")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="spotify"
        onClick={makeTVLaunchAppCall("spotify-beehive")}
      />
      <ImageButtonCard
        asset="discovery_plus"
        onClick={makeTVLaunchAppCall("com.discovery.dplus")}
      />
      <ImageButtonCard
        asset="fire_tv"
        onClick={makeTurnOnCall("script.sala_receiver_firetv")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="ps5"
        onClick={makeTurnOnCall("script.sala_tv_hdmi1")}
      />
      <ImageButtonCard
        asset="switch"
        onClick={makeTurnOnCall("script.sala_receiver_nintendo_switch")}
      />
      <ImageButtonCard
        asset="retropi"
        onClick={makeTurnOnCall("script.sala_receiver_pc")}
      />
    </ButtonRow>
  </Stack>
);
