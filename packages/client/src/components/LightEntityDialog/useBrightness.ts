import { HassEntity } from "home-assistant-js-websocket";
import { useRef } from "react";
import { RGB } from "../../utils/colors";
import { callService } from "../../utils/hass";
import {
  adjustColorBrightness,
  LightColorMode,
  LightGeneralMode,
  lightSupportsColorMode,
} from "../../utils/light";

export function useBrightness({
  mode,
  entity,
}: {
  mode: LightGeneralMode;
  entity: HassEntity;
}) {
  const brightnessAdjustRef = useRef(100);
  const brightnessAdjustedRef = useRef<number | undefined>(undefined);

  if (
    entity.attributes.color_mode === LightColorMode.RGB &&
    !lightSupportsColorMode(entity, LightColorMode.RGBWW) &&
    !lightSupportsColorMode(entity, LightColorMode.RGBW)
  ) {
    const maxVal = Math.max(...entity.attributes.rgb_color!);

    if (maxVal < 255) {
      brightnessAdjustedRef.current = maxVal;
      brightnessAdjustRef.current = (brightnessAdjustedRef.current / 255) * 100;
    }
  }

  const value = Math.round(
    ((entity.attributes.brightness || 0) * brightnessAdjustRef.current) / 255
  );

  function onChange(value: number) {
    if (mode === LightColorMode.WHITE) {
      callService("light", "turn_on", {
        entity_id: entity.entity_id,
        white: Math.min(255, Math.round((value * 255) / 100)),
      });

      return;
    }

    if (brightnessAdjustedRef.current) {
      const rgb = entity.attributes.rgb_color || ([0, 0, 0] as RGB);

      callService("light", "turn_on", {
        entity_id: entity.entity_id,
        brightness_pct: value,
        rgb_color: adjustColorBrightness(
          rgb,
          brightnessAdjustedRef.current,
          true
        ),
      });
      return;
    }

    callService("light", "turn_on", {
      entity_id: entity.entity_id,
      brightness_pct: value,
    });
  }

  return {
    brightnessAdjustedRef,
    value,
    onChange,
  };
}
