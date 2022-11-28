import { RGB } from "../utils/general";
import { callService, useEntities } from "../utils/hass";
import useModal from "../utils/useModal";
import ListItem from "./ListItem";
import LightDialog from "./LightDialog";
import EntitiesSwitch from "./EntitiesSwitch";

export default function RGBLightGroupRow({
  icon,
  label,
  entityIds,
}: {
  icon: string;
  label: string;
  entityIds: string[];
}) {
  const states = useEntities(...entityIds);
  const [mount, modals] = useModal();

  const checked = entityIds.some(
    (entityId) => states[entityId]?.state === "on"
  );

  function onColorChange(color: RGB) {
    entityIds.forEach((entityId) => {
      const entity = states[entityId];

      if (entity?.state === "on") {
        callService("light", "turn_on", {
          entity_id: entityId,
          rgb_color: color,
        });
      }
    });
  }

  function onBrightnessChange(brightness: number) {
    entityIds.forEach((entityId) => {
      const entity = states[entityId];

      if (entity?.state === "on") {
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
      .find((entity) => entity?.state === "on");

    const initialColor = firstOnEntity?.attributes?.rgb_color || [
      255, 255, 255,
    ];

    const initialBrightness = firstOnEntity?.attributes?.brightness || 255;

    mount((unmount) => (
      <LightDialog
        title={label}
        initialMode="color"
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

  return (
    <>
      {modals}
      <ListItem
        icon={icon}
        label={label}
        onSecondaryAction={checked ? onLightClick : undefined}
      >
        <EntitiesSwitch entityIds={entityIds} />
      </ListItem>
    </>
  );
}
