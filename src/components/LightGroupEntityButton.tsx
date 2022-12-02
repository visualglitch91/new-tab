import { RGB } from "../utils/general";
import { callService, useEntities } from "../utils/hass";
import useModal from "../utils/useModal";
import LightDialog from "./LightDialog";
import { getDisplayColorString } from "../utils/colorPresets";
import BaseEntityButton from "./BaseEntityButton";
import LightGroupDialog from "./LightGroupDialog";

export default function LightGroupEntityButton({
  icon = "mdi:television-ambient-light",
  label,
  entityIds,
}: {
  icon?: string;
  label: string;
  entityIds: string[];
}) {
  const states = useEntities(...entityIds);
  const [mount, modals] = useModal();

  let checked = false;
  const colorSet = new Set<string>();

  entityIds.forEach((entityId) => {
    const state = states[entityId];

    if (!state) {
      return;
    }

    const color: RGB | undefined = state.attributes.rgb_color;

    if (color) {
      colorSet.add(getDisplayColorString(color, 0.6));
    }

    if (state.state === "on") {
      checked = true;
    }
  });

  const colors = Array.from(colorSet);

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

    mount((unmount) => (
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
      callService("homeassistant", checked ? "turn_off" : "turn_on", {
        entity_id: entityId,
      });
    });
  }

  return (
    <>
      {modals}
      <BaseEntityButton
        icon={icon}
        label={label}
        checked={checked}
        color={colors[0]}
        onPrimaryAction={toggleState}
        onSecondaryAction={openLightDialog}
        onPress={() => {
          mount((unmount) => (
            <LightGroupDialog
              title={label}
              entityIds={entityIds}
              onClose={unmount}
            />
          ));
        }}
      />
    </>
  );
}
