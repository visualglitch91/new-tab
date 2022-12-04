import { callService, useEntity } from "../utils/hass";
import BaseEntityButton from "./BaseEntityButton";

export function TVEntityButton({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  const checked = useEntity("media_player.sala_tv")?.state === "on";
  const loading = useEntity("script.sala_ligar_tv")?.state === "on";

  return (
    <BaseEntityButton
      icon={icon}
      label={label}
      loading={loading}
      changeTimeout={30_000}
      checked={checked}
      onPrimaryAction={() => {
        if (checked) {
          callService("homeassistant", "turn_on", {
            entity_id: "script.ir_bridge_tv_energia",
          });
        } else {
          callService("homeassistant", "turn_on", {
            entity_id: "script.sala_ligar_tv",
          });
        }
      }}
    />
  );
}
