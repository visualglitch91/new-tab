import { RGB } from "../utils/general";
import { callService, useEntities } from "../utils/hass";
import useModal from "../utils/useModal";
import { css, styled } from "../styling";
import LightDialog from "./LightDialog";
import { getDisplayColorString } from "../utils/colorPresets";
import BaseEntityButton from "./BaseEntityButton";
import LightGroupDialog from "./LightGroupDialog";
import ColorBadge from "./ColorBadge";

const Colors = styled(
  "div",
  css`
    margin: -2px 0 -9px;
    display: flex;
    column-gap: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 3px 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  `
);

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
        label={
          colors.length > 1 ? (
            <Colors>
              {colors.map((color, index) => (
                <ColorBadge key={index} border color={color} size={9} />
              ))}
            </Colors>
          ) : (
            label
          )
        }
        checked={checked}
        color={colors.length === 1 ? colors[0] : undefined}
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
