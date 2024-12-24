import { makeServiceCall } from "$app/utils/hass";
import { GetPropsArgs } from "./types";

export default function getSelectProps({ entity, showMenu }: GetPropsArgs) {
  return {
    secondaryText: entity.state,
    onClick: (e: React.MouseEvent<any>) => {
      showMenu({
        mouseEvent: e.nativeEvent,
        clickAnchor: true,
        title: "Opções",
        options: entity.attributes.options.map((option) => ({
          label: option,
          onClick: makeServiceCall("select", "select_option", {
            entity_id: entity.entity_id,
            option,
          }),
        })),
      });
    },
  };
}
