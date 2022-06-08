import { useEffect, useMemo, useRef } from "preact/hooks";
import { HassEntity } from "home-assistant-js-websocket";
import iro from "@jaames/iro";
import { debounce, rgbToHex } from "../utils/general";
import { callService } from "../utils/hass";
import MaterialIcon from "./MaterialIcon";
import Button from "./Button";
import "./LightDialog.css";

type RGB = [number, number, number];

export default function LightDialog({
  title,
  entity,
  onDone,
}: {
  title?: string;
  entity: HassEntity;
  onDone: () => void;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const { attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const onDoneRef = useRef(onDone);

  const triggerChange = useMemo(() => {
    return debounce(function onColorChange(
      data: { rgb_color: RGB } | { brightness: number }
    ) {
      console.log({ data });
      callService("light", "turn_on", {
        entity_id: entity.entity_id,
        ...data,
      });
    });
  }, []);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    window.location.hash = "light-dialog";

    function onHashChange() {
      onDoneRef.current();
    }

    const color = rgbToHex(
      attributes.rgb_color[0],
      attributes.rgb_color[1],
      attributes.rgb_color[2]
    );

    const picker: iro.ColorPicker = new (iro as any).ColorPicker(
      pickerRef.current!,
      { color, sliderSize: 0 }
    );

    picker.on("color:change", ({ rgb }: any) => {
      triggerChange({ rgb_color: [rgb.r, rgb.g, rgb.b] });
    });

    setTimeout(() => {
      window.addEventListener("hashchange", onHashChange);
    }, 10);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <div class="component__light-dialog__wrapper">
      <div class="component__light-dialog">
        <div class="component__light-dialog-header">
          {title || friendlyName}
        </div>
        <div class="component__light-dialog__range-wrapper">
          <MaterialIcon icon="mdi:brightness-5" />
          <input
            type="range"
            min={0}
            max={255}
            defaultValue={attributes.brightness}
            onInput={(e) => {
              triggerChange({ brightness: Number(e.currentTarget.value) });
            }}
          />
        </div>
        <div ref={pickerRef} />
        <div class="component__light-dialog-footer">
          <Button onClick={onDone}>Ok</Button>
        </div>
      </div>
    </div>
  );
}
