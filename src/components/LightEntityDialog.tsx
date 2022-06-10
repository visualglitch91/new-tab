import { HassEntity } from "home-assistant-js-websocket";
import { callService } from "../utils/hass";
import LightDialog, { LightDialogFeatures } from "./LightDialog";

export default function LightEntityDialog({
  title,
  entity,
  onDone,
}: {
  title?: string;
  entity: HassEntity;
  onDone: () => void;
}) {
  const {
    friendly_name: friendlyName,
    color_mode: colorMode,
    color_temp: colorTemp,
    min_mireds: minTemperature,
    max_mireds: maxTemperature,
    brightness,
    rgb_color: color,
  } = entity.attributes;

  function onChange(key: string, value: any) {
    callService("light", "turn_on", {
      entity_id: entity.entity_id,
      [key]: value,
    });
  }

  const features: Partial<LightDialogFeatures> = {
    brightness: {
      initialValue: typeof brightness === "undefined" ? 255 : brightness,
      onChange: (value) => onChange("brightness", value),
    },
  };

  if (colorMode === "rgb") {
    features.color = {
      initialValue: typeof color === "undefined" ? [255, 255, 255] : color,
      onChange: (value) => onChange("rgb_color", value),
    };
  }

  if (colorMode === "color_temp") {
    features.temperature = {
      min: minTemperature,
      max: maxTemperature,
      initialValue: colorTemp || minTemperature,
      onChange: (value) => onChange("color_temp", value),
    };
  }

  return (
    <LightDialog
      title={title || friendlyName}
      features={features}
      onDone={onDone}
    />
  );
}
