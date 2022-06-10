import { renderModal } from "../utils/general";
import { callService, useHass } from "../utils/hass";
import LightDialog, { RGB } from "./LightDialog";
import EntitiesSwitch from "./EntitiesSwitch";
import ListCardRow from "./ListCardRow";

export default function RGBLightGroupRow({
  icon,
  label,
  entityIds,
}: {
  icon: string;
  label: string;
  entityIds: string[];
}) {
  const { states } = useHass();
  const checked = entityIds.some((entityId) => states[entityId].state === "on");

  function onColorChange(color: RGB) {
    entityIds.forEach((entityId) => {
      if (states[entityId].state === "on") {
        callService("light", "turn_on", {
          entity_id: entityId,
          rgb_color: color,
        });
      }
    });
  }

  function onBrightnessChange(brightness: number) {
    entityIds.forEach((entityId) => {
      if (states[entityId].state === "on") {
        callService("light", "turn_on", {
          entity_id: entityId,
          brightness,
        });
      }
    });
  }

  function onLightClick() {
    const firstOnEntity = entityIds
      .map((id) => states[id])
      .find((entity) => entity.state === "on");

    const initialColor = firstOnEntity?.attributes?.rgb_color || [
      255, 255, 255,
    ];

    const initialBrightness = firstOnEntity?.attributes?.brightness || 255;

    renderModal((unmount) => (
      <LightDialog
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
        onDone={unmount}
      />
    ));
  }

  return (
    <ListCardRow
      icon={icon}
      label={label}
      onIconClick={checked ? onLightClick : undefined}
    >
      <EntitiesSwitch entityIds={entityIds} />
    </ListCardRow>
  );
}
