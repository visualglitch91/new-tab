import { useEntity, getIcon, makeServiceCall } from "../utils/hass";
import LightEntityDialog from "./LightEntityDialog";
import { renderModal, RGB } from "../utils/general";
import {
  isColorEqual,
  getDisplayColor,
  getDisplayColorString,
} from "../utils/colorPresets";
import BaseEntityButton from "./BaseEntityButton";

export default function EntityButton({
  icon: customIcon,
  label,
  changeTimeout,
  entityId,
  onTap,
  onPress,
  onDoubleTap,
}: {
  icon?: string;
  label?: string;
  changeTimeout?: number;
  entityId: string;
  onTap?: () => void;
  onPress?: () => void;
  onDoubleTap?: () => void;
}) {
  const entity = useEntity(entityId);

  if (!entity) {
    return <BaseEntityButton unavailable label={label || entityId} />;
  }

  const icon = customIcon || getIcon(entity);
  const { state, attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const [domain] = entityId.split(".");
  const checked = state === "on";
  const unavailable = state === "unavailable";

  const displayColor =
    domain === "light" &&
    ["hs", "rgb"].includes(attributes.color_mode) &&
    Array.isArray(attributes.rgb_color)
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

  function onLightDetails() {
    if (domain === "light" && checked) {
      renderModal((unmount) => (
        <LightEntityDialog title={label} entity={entity!} onClose={unmount} />
      ));
    }
  }

  return (
    <BaseEntityButton
      checked={checked}
      unavailable={unavailable}
      icon={icon}
      label={label || friendlyName}
      changeTimeout={changeTimeout}
      backgroundColor={
        displayColor && !isWhite
          ? getDisplayColorString(displayColor, 0.6)
          : undefined
      }
      onTap={
        onTap ||
        makeServiceCall("homeassistant", checked ? "turn_off" : "turn_on", {
          entity_id: entityId,
        })
      }
      onPress={onPress || onLightDetails}
      onDoubleTap={onDoubleTap || onLightDetails}
    />
  );
}
