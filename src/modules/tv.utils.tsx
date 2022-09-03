import { callService, makeServiceCall, useHass } from "../utils/hass";
import ButtonCard from "../components/ButtonCard";
import Icon from "../components/Icon";
import DelayedSwitch from "../components/DelayedSwitch";

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
  onClick,
}: {
  icon: string;
  size: number;
  onClick: () => void;
}) {
  return (
    <ButtonCard onClick={onClick}>
      <Icon icon={icon} size={size} />
    </ButtonCard>
  );
}

const imgStyle = {
  objectFit: "contain",
  height: "70%",
  width: "70%",
};

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
  onClick,
}: {
  asset: keyof typeof assets;
  onClick: () => void;
}) {
  return (
    <ButtonCard onClick={onClick}>
      <img src={assets[asset]} style={imgStyle} />
    </ButtonCard>
  );
}

export function TVSwitch() {
  const { states } = useHass();
  const checked = states["input_boolean.sala_tv_state"].state === "on";

  function toggle() {
    callService("homeassistant", "turn_on", {
      entity_id: "script.ir_bridge_tv_energia",
    });
  }

  return <DelayedSwitch delay={30_000} checked={checked} onInput={toggle} />;
}

export function SurroundSwitch() {
  const { states } = useHass();
  const checked = states["switch.sala_receiver"].state === "on";

  function toggle() {
    callService("homeassistant", checked ? "turn_off" : "turn_on", {
      entity_id: "switch.sala_receiver",
    });
  }

  return <DelayedSwitch delay={30_000} checked={checked} onInput={toggle} />;
}
