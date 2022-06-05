import { makeWebOSCall } from "../utils/hass.mjs";

export const rgbEntity = {
  label: "RGB",
  entityId: "light.sala_luz_ambiente",
};

export const homeTheaterEntity = {
  entityId: "switch.sala_receiver",
  label: "Surround",
  icon: "mdi:surround-sound",
};

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

export const svgStyle = {
  height: "23px",
  maxWidth: "80%",
};

export const imgStyle = {
  objectFit: "contain",
  height: "70%",
  width: "80%",
};
