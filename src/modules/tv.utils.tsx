import { makeServiceCall } from "../utils/hass";
import ButtonCard from "../components/ButtonCard";
import Icon from "../components/Icon";

export function makeTVButtonCall(button: string) {
  return makeServiceCall("shell_command", "custom_webos_button", { button });
}

function makeTVCommandCall(command: string, data?: any) {
  return makeServiceCall("shell_command", "custom_webos_command", {
    command,
    ...data,
  });
}

export function makeTVMediaControlCall(command: string) {
  return makeTVCommandCall(`media.controls/${command}`);
}

export function makeTVLaunchAppCall(appId: string) {
  return makeTVCommandCall("com.webos.applicationManager/launch", {
    payload: { id: appId },
  });
}

export function IconButtonCard({
  icon,
  size,
  action,
  repeatOnHold,
}: {
  icon: string;
  size: number;
  action: () => void;
  repeatOnHold?: boolean;
}) {
  const onHold = repeatOnHold ? action : undefined;

  return (
    <ButtonCard onTap={action} onPress={onHold} onHold={onHold}>
      <Icon icon={icon} size={size} />
    </ButtonCard>
  );
}

const imgStyle = {
  objectFit: "contain",
  height: "70%",
  width: "70%",
} as const;

const assets = {
  disneyplus: require("../assets/disneyplus.png"),
  globo: require("../assets/globo.png"),
  globoplay: require("../assets/globoplay.png"),
  hbomax: require("../assets/hbomax.png"),
  netflix: require("../assets/netflix.png"),
  plex: require("../assets/plex.png"),
  prime_video: require("../assets/prime_video.png"),
  discovery_plus: require("../assets/discovery_plus.png"),
  fire_tv: require("../assets/fire_tv.png"),
  ps5: require("../assets/ps5.png"),
  spotify: require("../assets/spotify.png"),
  starplus: require("../assets/starplus.png"),
  switch: require("../assets/switch.png"),
  windows: require("../assets/windows.png"),
  youtube: require("../assets/youtube.png"),
  retropi: require("../assets/retropi.png"),
};

export function ImageButtonCard({
  asset,
  action,
  repeatOnHold,
}: {
  asset: keyof typeof assets;
  action: () => void;
  repeatOnHold?: boolean;
}) {
  const onHold = repeatOnHold ? action : undefined;

  return (
    <ButtonCard onTap={action} onPress={onHold} onHold={onHold}>
      <img alt="" src={assets[asset]} style={imgStyle} />
    </ButtonCard>
  );
}
