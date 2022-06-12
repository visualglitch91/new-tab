import { useEffect, useRef, useState } from "preact/hooks";
import { useDebouncedCallback, RGB } from "../utils/general";
import Icon from "./Icon";
import DialogBase from "./DialogBase";
import ColorPresets from "./ColorPresets";
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
  onClose,
}: {
  title?: string;
  features: Partial<LightDialogFeatures>;
  onClose: () => void;
}) {
  const onCloseRef = useRef(onClose);
  const featuresRef = useRef(features);

  const [selectedColor, setSelectedColor] = useState(
    features.color?.initialValue
  );

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
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    window.location.hash = "light-dialog";

    function onHashChange() {
      onCloseRef.current();
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
    <DialogBase title={title} onClose={onClose}>
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
      {features.color && (
        <ColorPresets
          class="component__light-dialog__color-presets"
          selected={selectedColor}
          onChange={(color) => {
            setSelectedColor(color);
            onChange("color", color);
          }}
        />
      )}
    </DialogBase>
  );
}
