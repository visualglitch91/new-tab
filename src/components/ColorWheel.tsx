import { useEffect, useRef } from "preact/hooks";
import iro from "@jaames/iro";
import { useDebouncedCallback, rgbToHex, RGB } from "../utils/general";

export default function ColorWheel({
  initialColor,
  onChange,
}: {
  initialColor: RGB;
  onChange: (color: RGB) => void;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const debouncedOnChange = useDebouncedCallback(onChange);

  useEffect(() => {
    if (!pickerRef.current) {
      throw new Error("Color Picker node not set");
    }

    const color = rgbToHex(initialColor[0], initialColor[1], initialColor[2]);

    //@ts-expect-error Bad lib typings
    const picker: iro.ColorPicker = new iro.ColorPicker(pickerRef.current, {
      color,
      sliderSize: 0,
    });

    picker.on(
      "color:change",
      ({ rgb }: { rgb: { r: number; g: number; b: number } }) => {
        debouncedOnChange([rgb.r, rgb.g, rgb.b]);
      }
    );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={pickerRef} />;
}
