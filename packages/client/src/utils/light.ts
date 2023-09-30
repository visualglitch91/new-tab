import {
  HassEntityBase,
  HassEntityAttributeBase,
} from "home-assistant-js-websocket";
import { RGB } from "./general";
import { callService } from "./hass";

export const enum LightEntityFeature {
  EFFECT = 4,
  FLASH = 8,
  TRANSITION = 32,
}

export const enum LightColorMode {
  UNKNOWN = "unknown",
  ONOFF = "onoff",
  BRIGHTNESS = "brightness",
  COLOR_TEMP = "color_temp",
  HS = "hs",
  XY = "xy",
  RGB = "rgb",
  RGBW = "rgbw",
  RGBWW = "rgbww",
  WHITE = "white",
}

export type LightGeneralMode = "color" | LightColorMode;

const modesSupportingColor = [
  LightColorMode.HS,
  LightColorMode.XY,
  LightColorMode.RGB,
  LightColorMode.RGBW,
  LightColorMode.RGBWW,
];

const modesSupportingBrightness = [
  ...modesSupportingColor,
  LightColorMode.COLOR_TEMP,
  LightColorMode.BRIGHTNESS,
  LightColorMode.WHITE,
];

export const lightSupportsColorMode = (
  entity: LightEntity,
  mode: LightColorMode
) => entity.attributes.supported_color_modes?.includes(mode) || false;

export const lightIsInColorMode = (entity: LightEntity) =>
  (entity.attributes.color_mode &&
    modesSupportingColor.includes(entity.attributes.color_mode)) ||
  false;

export const lightSupportsColor = (entity: LightEntity) =>
  entity.attributes.supported_color_modes?.some((mode) =>
    modesSupportingColor.includes(mode)
  );

const lightSupportsBrightness = (entity: LightEntity) =>
  entity.attributes.supported_color_modes?.some((mode) =>
    modesSupportingBrightness.includes(mode)
  ) || false;

export function getSupportedFeatures(entity: LightEntity) {
  const brightness = lightSupportsBrightness(entity);
  const temp = lightSupportsColorMode(entity, LightColorMode.COLOR_TEMP);
  const white = lightSupportsColorMode(entity, LightColorMode.WHITE);
  const rgbww = lightSupportsColorMode(entity, LightColorMode.RGBWW);
  const rgbw = !rgbww && lightSupportsColorMode(entity, LightColorMode.RGBW);
  const color = rgbww || rgbw || lightSupportsColor(entity);

  return {
    brightness,
    temp,
    white,
    rgbww,
    rgbw,
    color,
  };
}

export const getLightCurrentModeRgbColor = (
  entity: LightEntity
): number[] | undefined =>
  entity.attributes.color_mode === LightColorMode.RGBWW
    ? entity.attributes.rgbww_color
    : entity.attributes.color_mode === LightColorMode.RGBW
    ? entity.attributes.rgbw_color
    : entity.attributes.rgb_color;

interface LightEntityAttributes extends HassEntityAttributeBase {
  min_color_temp_kelvin?: number;
  max_color_temp_kelvin?: number;
  min_mireds?: number;
  max_mireds?: number;
  brightness?: number;
  xy_color?: [number, number];
  hs_color?: [number, number];
  color_temp?: number;
  color_temp_kelvin?: number;
  rgb_color?: [number, number, number];
  rgbw_color?: [number, number, number, number];
  rgbww_color?: [number, number, number, number, number];
  effect?: string;
  effect_list?: string[] | null;
  supported_color_modes?: LightColorMode[];
  color_mode?: LightColorMode;
}

export interface LightEntity extends HassEntityBase {
  attributes: LightEntityAttributes;
}

export function adjustColorBrightness(
  rgbColor: RGB,
  value?: number,
  invert = false
) {
  if (value !== undefined && value !== 255) {
    let ratio = value / 255;

    if (invert) {
      ratio = 1 / ratio;
    }

    rgbColor[0] = Math.min(255, Math.round(rgbColor[0] * ratio));
    rgbColor[1] = Math.min(255, Math.round(rgbColor[1] * ratio));
    rgbColor[2] = Math.min(255, Math.round(rgbColor[2] * ratio));
  }

  return rgbColor;
}

export function setRgbWColor(entity: LightEntity, rgbColor: RGB) {
  if (lightSupportsColorMode(entity, LightColorMode.RGBWW)) {
    const rgbww_color: [number, number, number, number, number] = entity
      .attributes.rgbww_color
      ? [...entity.attributes.rgbww_color]
      : [0, 0, 0, 0, 0];

    callService("light", "turn_on", {
      entity_id: entity.entity_id,
      rgbww_color: rgbColor.concat(rgbww_color.slice(3)),
    });
  } else if (lightSupportsColorMode(entity, LightColorMode.RGBW)) {
    const rgbw_color: [number, number, number, number] = entity.attributes
      .rgbw_color
      ? [...entity.attributes.rgbw_color]
      : [0, 0, 0, 0];

    callService("light", "turn_on", {
      entity_id: entity.entity_id,
      rgbw_color: rgbColor.concat(rgbw_color.slice(3)),
    });
  }
}
