import { HassEntity } from "home-assistant-js-websocket";
import { useRef } from "preact/hooks";
import { callService } from "../utils/hass";
import LightDialog, { LightDialogFeatures } from "./LightDialog";

export default function LightEntityDialog({
  title,
  entity,
  onClose,
}: {
  title?: string;
  entity: HassEntity;
  onClose: () => void;
}) {
  const attrs = entity.attributes;
  const {
    friendly_name: friendlyName,
    supported_color_modes: colorModes,
    min_mireds: minTemperature,
    max_mireds: maxTemperature,
    brightness,
  } = attrs;

  const color = attrs.rgb_color || [255, 255, 255];
  const temperature = attrs.color_temp || maxTemperature;
  const colorMode = attrs.color_mode === "color_temp" ? "temperature" : "color";
  const stateRef = useRef({ temperature, color });

  function onChange(key: string, value: any) {
    callService("light", "turn_on", {
      entity_id: entity.entity_id,
      [key]: value,
    });
  }

  const hasTemp = colorModes.includes("color_temp");
  const hasColor = colorModes.includes("rgb") || colorModes.includes("hs");

  const features: Partial<LightDialogFeatures> = {
    brightness: {
      initialValue: typeof brightness === "undefined" ? 255 : brightness,
      onChange: (value) => onChange("brightness", value),
    },
  };

  if (hasColor) {
    features.color = {
      initialValue: typeof color === "undefined" ? [255, 255, 255] : color,
      onChange: (value) => {
        stateRef.current.color = value;
        onChange("rgb_color", value);
      },
    };
  }

  if (hasTemp) {
    features.temperature = {
      min: minTemperature,
      max: maxTemperature,
      initialValue: temperature || minTemperature,
      onChange: (value) => {
        stateRef.current.temperature = value;
        onChange("color_temp", value);
      },
    };
  }

  return (
    <LightDialog
      title={title || friendlyName}
      initialMode={colorMode}
      features={features}
      onModeChange={(mode) => {
        if (mode === "temperature") {
          onChange("color_temp", stateRef.current.temperature);
        } else {
          onChange("rgb_color", stateRef.current.color);
        }
      }}
      onClose={onClose}
    />
  );
}
