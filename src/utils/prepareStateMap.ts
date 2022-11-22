import { HassEntity } from "home-assistant-js-websocket";

export default function prepareStateMap(
  stateMap: Record<string, HassEntity | undefined>
) {
  if (stateMap["light.sala_luz"]?.attributes) {
    stateMap["light.sala_luz"].attributes.color_mode =
      stateMap["sensor.sala_luz_color_temp"]?.state;
  }

  return stateMap;
}
