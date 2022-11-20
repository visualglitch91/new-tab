import { makeServiceCall, useHass } from "../utils/hass";
import BaseEntityButton from "./BaseEntityButton";

export function TVEntityButton({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  const { states } = useHass();
  const checked = states["input_boolean.sala_tv_state"].state === "on";

  return (
    <BaseEntityButton
      icon={icon}
      label={label}
      changeTimeout={30_000}
      checked={checked}
      onPrimaryAction={makeServiceCall("homeassistant", "turn_on", {
        entity_id: "script.ir_bridge_tv_energia",
      })}
    />
  );
}
