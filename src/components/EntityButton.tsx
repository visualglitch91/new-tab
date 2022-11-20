import { useHass, getIcon, makeServiceCall } from "../utils/hass";
import LightEntityDialog from "./LightEntityDialog";
import { renderModal, RGB } from "../utils/general";
import {
  isColorEqual,
  getDisplayColor,
  getDisplayColorString,
} from "../utils/colorPresets";
import Icon from "./Icon";
import ButtonCard from "./ButtonCard";
import BaseEntityButton from "./BaseEntityButton";

export default function EntityButton({
  icon: customIcon,
  label,
  changeTimeout,
  entityId,
}: {
  icon?: string;
  label?: string;
  changeTimeout?: number;
  entityId: string;
}) {
  const hass = useHass();
  const entity = hass.states[entityId];

  if (!entity) {
    return (
      <ButtonCard disabled class="component__entity-button">
        <Icon icon="cancel" />
        <div class="component__entity-button__label">{label || entityId}</div>
      </ButtonCard>
    );
  }

  const icon = customIcon || getIcon(entity);
  const { state, attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const [domain] = entityId.split(".");
  const checked = state === "on";
  const unavailable = state === "unavailable";

  if (domain === "light") {
    console.log(attributes.color_mode);
  }

  const displayColor =
    domain === "light" && ["hs", "rgb"].includes(attributes.color_mode)
      ? getDisplayColor(attributes.rgb_color)
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
        <LightEntityDialog title={label} entity={entity} onClose={unmount} />
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
      onTap={makeServiceCall(
        "homeassistant",
        checked ? "turn_off" : "turn_on",
        { entity_id: entityId }
      )}
      onPress={onLightDetails}
      onDoubleTap={onLightDetails}
    />
  );
}
