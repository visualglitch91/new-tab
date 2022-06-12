import { renderModal, RGB } from "../utils/general";
import { callService, useHass } from "../utils/hass";
import FlexRow from "./FlexRow";
import PillButton from "./PillButton";
import LightDialog from "./LightDialog";
import ColorBadge from "./ColorBadge";

export default function RGBLightGroupButtons({
  entities: config,
}: {
  entities: { label: string; entityId: string }[];
}) {
  const { states } = useHass();

  const entities = config.map((it) => {
    const { state, attributes: attrs } = states[it.entityId];
    const on = state === "on";

    return {
      ...it,
      on,
      brightness: (typeof attrs?.brightness === "undefined"
        ? 100
        : attrs?.brightness) as number,
      color: (typeof attrs?.rgb_color === "undefined"
        ? [255, 255, 255]
        : attrs?.rgb_color) as RGB,
    };
  });

  if (!entities.some((it) => it.on)) {
    return null;
  }

  type Entities = typeof entities;

  const multiple = entities.length > 1;

  const uniqueColor = multiple
    ? entities.reduce((acc, entity) => {
        if (acc && acc.join(",") === entity.color.join(",")) {
          return acc;
        }

        return undefined;
      }, entities[0].color as RGB | undefined)
    : undefined;

  function onColorChange(entities: Entities, color: RGB) {
    entities.forEach(({ entityId }) => {
      callService("light", "turn_on", {
        entity_id: entityId,
        rgb_color: color,
      });
    });
  }

  function onBrightnessChange(entities: Entities, brightness: number) {
    entities.forEach(({ entityId }) => {
      callService("light", "turn_on", {
        entity_id: entityId,
        brightness,
      });
    });
  }

  function onLightClick(entities: Entities, label?: string) {
    const initialColor = entities[0].color;
    const initialBrightness = entities[0].brightness;

    renderModal((unmount) => (
      <LightDialog
        title={label || entities[0].label}
        features={{
          color: {
            initialValue: initialColor,
            onChange: (value) => onColorChange(entities, value),
          },
          brightness: {
            initialValue: initialBrightness,
            onChange: (value) => onBrightnessChange(entities, value),
          },
        }}
        onDone={unmount}
      />
    ));
  }

  return (
    <FlexRow align="right">
      {entities.map((it) => (
        <PillButton
          key={it.entityId}
          label={
            <>
              {!uniqueColor && it.on && (
                <ColorBadge color={it.color} style={{ marginTop: -2 }} />
              )}
              {it.label}
            </>
          }
          onClick={() => onLightClick([it])}
        />
      ))}
      {multiple && (
        <PillButton
          label={
            <>
              {uniqueColor && (
                <ColorBadge color={uniqueColor} style={{ marginTop: -2 }} />
              )}
              Todos
            </>
          }
          onClick={() => onLightClick(entities, "Todos")}
        />
      )}
    </FlexRow>
  );
}
