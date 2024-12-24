import {
  RGB,
  rgbToHex,
  isColorEqual,
  getDisplayColor,
} from "$app/utils/colors";
import { makeServiceCall } from "$app/utils/hass";
import { lightSupportsColor } from "$app/utils/light";
import LightEntityDialog from "../LightEntityDialog";
import { GetPropsArgs } from "./types";

export default function getLightProps({
  label,
  entity,
  mount,
  confirm,
  confirmBefore,
}: GetPropsArgs) {
  const { attributes } = entity;

  const displayColor =
    lightSupportsColor(entity) && Array.isArray(attributes.rgb_color)
      ? getDisplayColor(attributes.rgb_color as RGB)
      : attributes.color_mode === "color_temp"
      ? attributes.color_temp >
        (attributes.max_mireds + attributes.min_mireds) / 2
        ? ([255, 168, 66] as RGB)
        : ([255, 255, 255] as RGB)
      : undefined;

  const isWhite = displayColor
    ? isColorEqual(displayColor, [255, 255, 255])
    : false;

  const toggle = makeServiceCall("homeassistant", "toggle", {
    entity_id: entity.entity_id,
  });

  return {
    color: displayColor && !isWhite ? rgbToHex(displayColor) : undefined,
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
    onIconClick: () => {
      mount((_, dialogProps) => (
        <LightEntityDialog
          title={label}
          entityId={entity!.entity_id}
          {...dialogProps}
        />
      ));
    },
  };
}
