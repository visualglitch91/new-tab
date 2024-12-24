import { makeServiceCall } from "$app/utils/hass";
import { GetPropsArgs } from "./types";

export default function getSwitchProps({
  entity,
  confirm,
  confirmBefore,
}: GetPropsArgs) {
  const toggle = makeServiceCall("homeassistant", "toggle", {
    entity_id: entity.entity_id,
  });

  return {
    onClick: () => {
      if (
        confirmBefore === "toggle" ||
        (confirmBefore === "on" && entity.state !== "on") ||
        (confirmBefore === "off" && entity.state === "on")
      ) {
        confirm({ title: "Continuar?", onConfirm: toggle });
      } else {
        toggle();
      }
    },
  };
}
