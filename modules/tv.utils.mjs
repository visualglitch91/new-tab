import { h, useState } from "../utils/preact.mjs";
import { callService, makeWebOSCall, useHass } from "../utils/hass.mjs";
import ListCard from "../components/ListCard.mjs";
import ButtonCard from "../components/ButtonCard.mjs";
import MaterialIcon from "../components/MaterialIcon.mjs";
import Switch from "../components/Switch.mjs";
import DelayedSwitch from "../components/DelayedSwitch.mjs";

export function makeTVButtonCall(button) {
  return makeWebOSCall("button", "media_player.sala_tv", { button });
}

function makeTVCommandCall(command, data) {
  return makeWebOSCall("command", "media_player.sala_tv", { command, ...data });
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

export function EntityCard({ label, icon, entityId, renderContent }) {
  return h`<${ListCard} rows=${[{ label, icon, entityId, renderContent }]} />`;
}

export function TVSwitch() {
  const { states } = useHass();
  const checked = states["media_player.sala_tv"].state === "on";

  function toggle() {
    callService("homeassistant", "turn_on", { entity_id: "scene.tv_ligar" });
  }

  return h`
    <${DelayedSwitch}
      checkDelay=${15_000}
      uncheckDelay=${5_000}
      checked=${checked}
      onInput=${toggle}
    />`;
}

export function SurroundSwitch() {
  const { states } = useHass();
  const checked = states["switch.sala_receiver"].state === "on";

  function toggle() {
    callService("homeassistant", checked ? "turn_off" : "turn_on", {
      entity_id: "switch.sala_receiver",
    });
  }

  return h`
    <${DelayedSwitch}
      checkDelay=${20_000}
      uncheckDelay=${5_000}
      checked=${checked}
      onInput=${toggle}
    />`;
}
