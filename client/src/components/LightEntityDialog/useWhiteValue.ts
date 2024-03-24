import { HassEntity } from "home-assistant-js-websocket";
import { callService } from "$client/utils/hass";
import { LightColorMode } from "../../utils/light";

export function useWhiteValue({
  currentRGB,
  entity,
}: {
  currentRGB: number[] | undefined;
  entity: HassEntity;
}) {
  const value =
    entity.attributes.color_mode === LightColorMode.RGBW
      ? Math.round((entity.attributes.rgbw_color![3] * 100) / 255)
      : undefined;

  function onChange(value: number) {
    const wv = Math.min(255, Math.round((value * 255) / 100));
    const rgbw_color = currentRGB || [0, 0, 0, 0];

    rgbw_color[3] = wv;

    callService("light", "turn_on", {
      entity_id: entity.entity_id,
      rgbw_color,
    });
  }

  return { value, onChange };
}
