import { HassEntity } from "home-assistant-js-websocket";
import { callService } from "$app/utils/hass";

export function useTemperature({ entity }: { entity: HassEntity }) {
  return {
    value: entity.attributes.color_temp_kelvin,
    onChange: (value: number) => {
      callService("light", "turn_on", {
        entity_id: entity.entity_id,
        color_temp_kelvin: value,
      });
    },
  };
}
