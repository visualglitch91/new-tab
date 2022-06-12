import { useEffect, useRef } from "preact/hooks";
import iro from "@jaames/iro";
import { useDebouncedCallback, rgbToHex, RGB } from "../utils/general";
import Icon from "./Icon";
import Button from "./Button";
import "./LightDialog.css";

export interface LightDialogFeatures {
  brightness: {
    initialValue: number;
    onChange: (value: number) => void;
  };
  temperature: {
    min: number;
    max: number;
    initialValue: number;
    onChange: (value: number) => void;
  };
  color: {
    initialValue: RGB;
    onChange: (value: RGB) => void;
  };
}

export default function LightDialog({
  title,
  features,
  onDone,
}: {
  title?: string;
  features: Partial<LightDialogFeatures>;
  onDone: () => void;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  const featuresRef = useRef(features);

  const onChange = useDebouncedCallback(
    <K extends keyof LightDialogFeatures, F extends LightDialogFeatures[K]>(
      key: K,
      value: F["initialValue"]
    ) => {
      const feature = featuresRef.current[key];

      if (feature) {
        //@ts-expect-error just ignore this
        feature.onChange(value);
      }
    }
  );

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    window.location.hash = "light-dialog";

    function onHashChange() {
      onDoneRef.current();
    }

    if (features.color) {
      if (!pickerRef.current) {
        throw new Error("Color Picker node not set");
      }

      const color = rgbToHex(
        features.color.initialValue[0],
        features.color.initialValue[1],
        features.color.initialValue[2]
      );

      //@ts-expect-error Bad lib typings
      const picker: iro.ColorPicker = new iro.ColorPicker(pickerRef.current, {
        color,
        sliderSize: 0,
      });

      picker.on(
        "color:change",
        ({ rgb }: { rgb: { r: number; g: number; b: number } }) => {
          onChange("color", [rgb.r, rgb.g, rgb.b]);
        }
      );
    }

    setTimeout(() => {
      window.addEventListener("hashchange", onHashChange);
    }, 10);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      class="component__light-dialog__wrapper"
      onClick={(e) => {
        if (
          (e.target as HTMLElement)?.className ===
          "component__light-dialog__wrapper"
        ) {
          onDone();
        }
      }}
    >
      <div class="component__light-dialog">
        <div class="component__light-dialog-header">{title}</div>
        {features.temperature ? (
          <div class="component__light-dialog__range-wrapper">
            <Icon icon="icofont-thermometer" />
            <input
              type="range"
              min={features.temperature.min}
              max={features.temperature.max}
              defaultValue={String(features.temperature.initialValue || 0)}
              onInput={(e) => {
                onChange("temperature", Number(e.currentTarget.value));
              }}
            />
          </div>
        ) : null}
        {features.brightness ? (
          <div class="component__light-dialog__range-wrapper">
            <Icon icon="mdi:brightness-5" />
            <input
              type="range"
              min={0}
              max={255}
              defaultValue={String(features.brightness.initialValue || 0)}
              onInput={(e) => {
                onChange("brightness", Number(e.currentTarget.value));
              }}
            />
          </div>
        ) : null}
        {Boolean(features.color) && <div ref={pickerRef} />}
        <div class="component__light-dialog-footer">
          <Button onClick={onDone}>Ok</Button>
        </div>
      </div>
    </div>
  );
}
