import { makeServiceCall } from "$app/utils/hass";
import { GetPropsArgs } from "./types";

export default function getButtonProps({
  entity,
  confirm,
  confirmBefore,
}: GetPropsArgs) {
  const press = makeServiceCall(entity.entity_id.split(".")[0], "press", {
    entity_id: entity.entity_id,
  });

  return {
    onClick: () => {
      if (confirmBefore) {
        confirm({ title: "Continuar?", onConfirm: press });
      } else {
        press();
      }
    },
  };
}
