import { callService, makeWebOSCall, useHass } from "../utils/hass";
import ButtonCard from "../components/ButtonCard";
import MaterialIcon from "../components/MaterialIcon";
import DelayedSwitch from "../components/DelayedSwitch";

export function makeTVButtonCall(button: string) {
  return makeWebOSCall("button", "media_player.sala_tv", { button });
}

function makeTVCommandCall(command: string, data?: any) {
  return makeWebOSCall("command", "media_player.sala_tv", { command, ...data });
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
      <MaterialIcon icon={icon} size={size} />
    </ButtonCard>
  );
}

const imgStyle = {
  objectFit: "contain",
  height: "70%",
  width: "80%",
};

const assets = {
  disneyplus: require("../assets/disneyplus.png"),
  globo: require("../assets/globo.png"),
  hbomax: require("../assets/hbomax.png"),
  netflix: require("../assets/netflix.png"),
  plex: require("../assets/plex.png"),
  prime_video: require("../assets/prime_video.png"),
  ps5: require("../assets/ps5.png"),
  spotify: require("../assets/spotify.png"),
  starplus: require("../assets/starplus.png"),
  switch: require("../assets/switch.png"),
  windows: require("../assets/windows.png"),
  youtube: require("../assets/youtube.png"),
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
  const checked = states["media_player.sala_tv"].state === "on";

  function toggle() {
    callService("homeassistant", "turn_on", { entity_id: "scene.tv_ligar" });
  }

  return (
    <DelayedSwitch
      checkDelay={15_000}
      uncheckDelay={5_000}
      checked={checked}
      onInput={toggle}
    />
  );
}

export function SurroundSwitch() {
  const { states } = useHass();
  const checked = states["switch.sala_receiver"].state === "on";

  function toggle() {
    callService("homeassistant", checked ? "turn_off" : "turn_on", {
      entity_id: "switch.sala_receiver",
    });
  }

  return (
    <DelayedSwitch
      checkDelay={20_000}
      uncheckDelay={5_000}
      checked={checked}
      onInput={toggle}
    />
  );
}
