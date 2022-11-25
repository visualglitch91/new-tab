import { makeServiceCall, useEntity } from "../utils/hass";
import BaseEntityButton from "./BaseEntityButton";

export function TVEntityButton({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  const checked = useEntity("media_player.sala_tv")?.state === "on";

  return (
    <BaseEntityButton
      icon={icon}
      label={label}
      changeTimeout={30_000}
      checked={checked}
      onTap={makeServiceCall("homeassistant", "turn_on", {
        entity_id: "script.ir_bridge_tv_energia",
      })}
    />
  );
}
