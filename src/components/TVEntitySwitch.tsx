import { makeServiceCall, useHass } from "../utils/hass";
import DelayedSwitch from "./DelayedSwitch";

export function TVEntitySwitch() {
  const { states } = useHass();
  const checked = states["input_boolean.sala_tv_state"].state === "on";

  return (
    <DelayedSwitch
      delay={30_000}
      checked={checked}
      onInput={makeServiceCall("homeassistant", "turn_on", {
        entity_id: "script.ir_bridge_tv_energia",
      })}
    />
  );
}
