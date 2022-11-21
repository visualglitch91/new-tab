import { renderModal, RGB } from "../utils/general";
import { callService, useEntities } from "../utils/hass";
import LightDialog from "./LightDialog";
import BaseEntityButton from "./BaseEntityButton";
import { getDisplayColorString, isColorEqual } from "../utils/colorPresets";

export default function MultiLightButton({
  icon,
  label,
  entityIds,
}: {
  icon: string;
  label: string;
  entityIds: string[];
}) {
  const states = useEntities(...entityIds);

  let checked = false;
  let uniqueColor: RGB | undefined;

  entityIds.forEach((entityId, index) => {
    const state = states[entityId];

    if (!state) {
      return;
    }

    const color: RGB | undefined = state.attributes.rgb_color;

    if (state.state === "on") {
      checked = true;
    }

    if (index === 0) {
      uniqueColor = color;
    } else if (uniqueColor && (!color || !isColorEqual(uniqueColor, color))) {
      uniqueColor = undefined;
    }
  });

  function onColorChange(color: RGB) {
    entityIds.forEach((entityId) => {
      callService("light", "turn_on", {
        entity_id: entityId,
        rgb_color: color,
      });
    });
  }

  function onBrightnessChange(brightness: number) {
    entityIds.forEach((entityId) => {
      callService("light", "turn_on", {
        entity_id: entityId,
        brightness,
      });
    });
  }

  function openLightDialog() {
    if (!checked) {
      return;
    }

    const firstOnEntity = entityIds
      .map((id) => states[id])
      .find((entity) => entity?.state === "on");

    const initialColor = firstOnEntity?.attributes?.rgb_color || [
      255, 255, 255,
    ];

    const initialBrightness = firstOnEntity?.attributes?.brightness || 255;

    renderModal((unmount) => (
      <LightDialog
        initialMode="color"
        title={label}
        features={{
          color: {
            initialValue: initialColor,
            onChange: onColorChange,
          },
          brightness: {
            initialValue: initialBrightness,
            onChange: onBrightnessChange,
          },
        }}
        onClose={unmount}
      />
    ));
  }

  function toggleState() {
    entityIds.forEach((entityId) => {
      callService("light", checked ? "turn_off" : "turn_on", {
        entity_id: entityId,
      });
    });
  }

  return (
    <BaseEntityButton
      icon={icon}
      label={label}
      checked={checked}
      backgroundColor={uniqueColor && getDisplayColorString(uniqueColor, 0.6)}
      onTap={toggleState}
      onPress={openLightDialog}
      onDoubleTap={openLightDialog}
    />
  );
}
