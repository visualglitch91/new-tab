import { h, useEffect, useRef, useState } from "../utils/preact.mjs";
import { callService, makeWebOSCall, useHass } from "../utils/hass.mjs";
import ListCard from "../components/ListCard.mjs";
import ButtonCard from "../components/ButtonCard.mjs";
import MaterialIcon from "../components/MaterialIcon.mjs";
import Switch from "../components/Switch.mjs";

export function makeTVButtonCall(button) {
  return makeWebOSCall("button", "media_player.sala_tv", { button });
}

function makeTVCommandCall(command) {
  return makeWebOSCall("command", "media_player.sala_tv", { command });
}

export function makeTVMediaControlCall(command) {
  return makeTVCommandCall(`media.controls/${command}`);
}

export function makeTVLaunchAppCall(appId) {
  return makeTVCommandCall("com.webos.applicationManager/launch", {
    payload: { id: appId },
  });
}

export function IconButtonCard({ icon, size, onClick }) {
  return h`
    <${ButtonCard} onClick=${onClick}>
      <${MaterialIcon} icon=${icon} size=${size} />
    </${ButtonCard}>`;
}

const imgStyle = {
  objectFit: "contain",
  height: "70%",
  width: "80%",
};

export function ImageButtonCard({ asset, onClick }) {
  return h`
    <${ButtonCard} onClick=${onClick}>
      <img src=${`assets/${asset}.png`} style=${imgStyle} />
    </${ButtonCard}>`;
}

export function EntityCard({ label, icon, entityId }) {
  return h`<${ListCard} rows=${[{ label, icon, entityId }]} />`;
}

export function TVSwitch() {
  const { states } = useHass();
  const isOn = states["media_player.sala_tv"].state === "on";
  const currentStateRef = useRef(isOn);
  const [checked, setChecked] = useState(isOn);

  useEffect(() => {
    currentStateRef.current = isOn;
  }, [isOn]);

  function toggle() {
    const isOn = currentStateRef.current;

    if (!isOn) {
      setTimeout(() => {
        setChecked(currentStateRef.current);
      }, 10_000);
    }

    setChecked(!isOn);
    callService("homeassistant", "turn_on", { entity_id: "scene.tv_ligar" });
  }

  return h`
    <${Switch}
      checked=${checked}
      onInput=${toggle}
    />
  `;
}
