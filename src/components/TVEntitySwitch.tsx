import { makeServiceCall, useEntity } from "../utils/hass";
import DelayedSwitch from "./DelayedSwitch";

export function TVEntitySwitch() {
  const checked = useEntity("media_player.sala_tv")?.state === "on";

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
