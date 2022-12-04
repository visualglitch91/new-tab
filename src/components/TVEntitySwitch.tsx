import { callService, useEntity } from "../utils/hass";
import DelayedSwitch from "./DelayedSwitch";

export function TVEntitySwitch() {
  const checked = useEntity("media_player.sala_tv")?.state === "on";
  const loading = useEntity("script.sala_ligar_tv")?.state === "on";

  return (
    <DelayedSwitch
      delay={30_000}
      checked={checked}
      loading={loading}
      onInput={() => {
        if (checked) {
          callService("homeassistant", "turn_on", {
            entity_id: "script.ir_bridge_tv_energia",
          });
        } else {
          callService("homeassistant", "turn_on", {
            entity_id: "script.sala_tv_globo",
          });
        }
      }}
    />
  );
}
