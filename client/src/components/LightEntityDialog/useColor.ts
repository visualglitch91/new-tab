import { HassEntity } from "home-assistant-js-websocket";
import { RGB } from "../../utils/colors";
import { callService } from "$client/utils/hass";
import {
  LightColorMode,
  lightSupportsColorMode,
  adjustColorBrightness,
  setRgbWColor,
} from "../../utils/light";

export function useColor({
  brightness,
  currentRGB,
  colorBrightness,
  brightnessAdjustedRef,
  entity,
}: {
  brightness: number;
  currentRGB: number[] | undefined;
  colorBrightness: number | undefined;
  brightnessAdjustedRef: React.MutableRefObject<number | undefined>;
  entity: HassEntity;
}) {
  const value = (currentRGB?.slice(0, 3) || [0, 0, 0]) as RGB;

  function setRGB(value: RGB) {
    callService("light", "turn_on", {
      entity_id: entity.entity_id,
      rgb_color: value,
    });
  }

  function onChange(value: RGB) {
    const brightnessAdjusted = brightnessAdjustedRef.current;

    if (
      lightSupportsColorMode(entity, LightColorMode.RGBWW) ||
      lightSupportsColorMode(entity, LightColorMode.RGBW)
    ) {
      setRgbWColor(
        entity,
        colorBrightness
          ? adjustColorBrightness(value, (colorBrightness * 255) / 100)
          : value
      );
    } else if (lightSupportsColorMode(entity, LightColorMode.RGB)) {
      if (brightnessAdjusted) {
        callService("light", "turn_on", {
          entity_id: entity.entity_id,
          brightness_pct: brightness,
          rgb_color: adjustColorBrightness(value, brightnessAdjusted, true),
        });
      } else {
        setRGB(value);
      }
    } else {
      setRGB(value);
    }
  }

  return { value, onChange, setRGB };
}
