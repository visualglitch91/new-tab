import { makeServiceCall, useEntity } from "../utils/hass";
import BaseEntityButton from "./BaseEntityButton";

export function TVEntityButton({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  const entity = useEntity("input_boolean.sala_tv_state");
  const checked = entity?.state === "on";

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
