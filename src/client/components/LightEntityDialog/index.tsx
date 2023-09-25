import { Fragment, useState } from "react";
import { styled } from "@mui/joy";
import { HassEntity } from "home-assistant-js-websocket";
import { useEntity } from "../../utils/hass";
import {
  LightColorMode,
  LightGeneralMode,
  lightIsInColorMode,
  getSupportedFeatures,
  getLightCurrentModeRgbColor,
} from "../../utils/light";
import { hsvToRGB, RGB, rgbToHS } from "../../utils/general";
import ColorPicker from "../ColorPicker";
import DialogBase from "../DialogBase";
import LabeledSlider from "../LabeledSlider";
import TabGroup from "../TabGroup";
import ColorPresets from "../ColorPresets";
import Stack from "../Stack";
import { useBrightness } from "./useBrightness";
import { useColor } from "./useColor";
import { useColorBrightness } from "./useColorBrightness";
import { useTemperature } from "./useTemperature";
import { useWhiteValue } from "./useWhiteValue";

const ColorStack = styled(Stack)({
  alignItems: "center",
  maxWidth: "310px",
  margin: "0 auto",
});

function Components({ entity }: { entity: HassEntity }) {
  const components = [];

  const [mode, onModeChange] = useState<LightGeneralMode>(() =>
    lightIsInColorMode(entity) ? "color" : entity.attributes.color_mode
  );

  const currentRGB = getLightCurrentModeRgbColor(entity);
  const currentHS = currentRGB && rgbToHS(currentRGB.slice(0, 3) as RGB);

  const currentRGBWithoutBrightness =
    currentHS && hsvToRGB(currentHS[0], currentHS[1], 100);

  const features = getSupportedFeatures(entity);

  const brightness = useBrightness({ mode, entity });

  const temperature = useTemperature({ entity });

  const colorBrightness = useColorBrightness({ entity, currentRGB });

  const color = useColor({
    brightness: brightness.value,
    currentRGB,
    colorBrightness: colorBrightness.value,
    brightnessAdjustedRef: brightness.brightnessAdjustedRef,
    entity,
  });

  const whiteValue = useWhiteValue({ entity, currentRGB });

  if (features.color && (features.temp || features.white)) {
    components.push(
      <TabGroup
        options={[
          {
            value: "color",
            label: "Cor",
          },
          features.temp
            ? {
                value: LightColorMode.COLOR_TEMP,
                label: "Frio/Quente",
              }
            : null,
          features.white
            ? {
                value: LightColorMode.WHITE,
                label: "Branco",
              }
            : null,
        ]}
        value={mode}
        onChange={onModeChange}
      />
    );
  }

  if (features.brightness) {
    components.push(
      <LabeledSlider
        label="Brilho"
        min={1}
        max={100}
        defaultValue={brightness.value}
        onChangeEnd={brightness.onChange}
      />
    );
  }

  if (
    features.temp &&
    ((!features.color && !features.white) || mode === "color_temp")
  ) {
    components.push(
      <LabeledSlider
        label="Temperatura"
        min={entity.attributes.min_color_temp_kelvin}
        max={entity.attributes.max_color_temp_kelvin}
        defaultValue={temperature.value}
        onChangeEnd={temperature.onChange}
      />
    );
  }

  if (
    features.color &&
    ((!features.temp && !features.white) || mode === "color")
  ) {
    components.push(
      <ColorStack>
        <ColorPicker selected={color.value} onChangeEnd={color.onChange} />
        <ColorPresets
          radius={8}
          size={46}
          selected={currentRGBWithoutBrightness}
          onChange={color.onChange}
        />
      </ColorStack>
    );

    if (features.rgbw || features.rgbww) {
      components.push(
        <LabeledSlider
          label="Brilho da Cor"
          min={0}
          max={100}
          defaultValue={colorBrightness.value}
          onChangeEnd={colorBrightness.onChange}
        />
      );
    }

    if (features.rgbw) {
      components.push(
        <>
          <LabeledSlider
            label="Brilho do Branco"
            min={0}
            max={100}
            defaultValue={whiteValue.value}
            onChangeEnd={whiteValue.onChange}
          />
        </>
      );
    }
  }

  return (
    <>
      {components.map((component, index) => (
        <Fragment key={index}>{component}</Fragment>
      ))}
    </>
  );
}

export default function LightEntityDialog({
  title,
  entityId,
  onClose,
}: {
  title?: React.ReactNode;
  entityId: string;
  onClose: () => void;
}) {
  const entity = useEntity(entityId);
  if (!entity) {
    return null;
  }

  return (
    <DialogBase title={title} onClose={onClose}>
      <Stack largeGap>
        <Components entity={entity} />
      </Stack>
    </DialogBase>
  );
}
