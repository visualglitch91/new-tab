import { callService, useEntity } from "../utils/hass";
import DelayedSwitch from "./DelayedSwitch";

export function TVEntitySwitch() {
  const checked = useEntity("media_player.sala_tv")?.state === "on";

  return (
    <DelayedSwitch
      delay={30_000}
      checked={checked}
      onChange={() => {
        if (checked) {
          callService("media_player", "turn_off", {
            entity_id: "media_player.sala_tv",
          });
        } else {
          callService("media_player", "turn_on", {
            entity_id: "media_player.sala_tv",
          });
        }
      }}
    />
  );
}
