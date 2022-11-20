import iro from "@jaames/iro";
import { useEffect, useRef } from "preact/hooks";
import { useDebouncedCallback, rgbToHex, RGB } from "../utils/general";
import "./ColorWheel.css";

export default function ColorWheel({
  width,
  selected = [255, 255, 255],
  onChangeEnd,
}: {
  width: number;
  selected?: RGB;
  onChangeEnd: (color: RGB) => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<iro.ColorPicker>();
  const debouncedOnChangeEnd = useDebouncedCallback(onChangeEnd);
  const color = rgbToHex(selected[0], selected[1], selected[2]);

  useEffect(() => {
    if (!nodeRef.current) {
      throw new Error("Color Picker node not set");
    }

    //@ts-expect-error
    const picker: iro.ColorPicker = new iro.ColorPicker(nodeRef.current, {
      width,
      color,
    });

    picker.on(
      "color:change",
      ({ rgb }: { rgb: { r: number; g: number; b: number } }) => {
        debouncedOnChangeEnd([rgb.r, rgb.g, rgb.b]);
      }
    );

    pickerRef.current = picker;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const picker = pickerRef.current;

    if (!picker) {
      throw new Error("Color Picker instance not set");
    }

    picker.setColors([color]);
  }, [color]);

  return <div ref={nodeRef} class="color-wheel" />;
}
