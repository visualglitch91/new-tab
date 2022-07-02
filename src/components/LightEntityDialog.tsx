import { HassEntity } from "home-assistant-js-websocket";
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
  const {
    friendly_name: friendlyName,
    supported_color_modes: colorModes,
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
      onChange: (value) => onChange("rgb_color", value),
    };
  }

  if (hasTemp) {
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
      onClose={onClose}
    />
  );
}
