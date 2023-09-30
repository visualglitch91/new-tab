import { callService, useEntity } from "../utils/hass";
import BaseEntityButton from "./BaseEntityButton";

const icon = "mdi:television";
const label = "TV";

export function TVEntityButton() {
  const checked = useEntity("media_player.sala_tv")?.state === "on";

  return (
    <BaseEntityButton
      icon={icon}
      label={label}
      changeTimeout={30_000}
      checked={checked}
      onPrimaryAction={() => {
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
