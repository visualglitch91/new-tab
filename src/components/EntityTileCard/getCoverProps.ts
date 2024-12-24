import { makeServiceCall } from "$app/utils/hass";
import { GetPropsArgs } from "./types";

export default function getCoverProps({ entity }: GetPropsArgs) {
  const open = entity.attributes?.raw_state === "open";

  return {
    active: false,
    secondaryText: open ? "Aberta" : "Fechada",
    onClick: makeServiceCall("cover", open ? "close_cover" : "open_cover", {
      entity_id: entity.entity_id,
    }),
  };
}
