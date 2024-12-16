import { useEffect, useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { useDebouncedCallback } from "$app/utils/useDebouncedCallback";
import { RGB, rgbToHS } from "$app/utils/colors";

function parseRGB(rgb: RGB) {
  const hsv = rgbToHS(rgb);
  return { h: hsv[0], s: hsv[1], v: 100, a: 1 };
}

export default function ColorPicker({
  selected = [255, 255, 255],
  onChangeEnd,
}: {
  selected?: RGB;
  onChangeEnd: (color: RGB) => void;
}) {
  const [internal, setInternal] = useState(() => parseRGB(selected));
  const debouncedOnChangeEnd = useDebouncedCallback(onChangeEnd);

  useEffect(() => {
    const parsed = parseRGB(selected);
    setInternal(parsed);
  }, [selected]);

  return (
    <Wheel
      color={internal}
      onChange={(color) => {
        setInternal(color.hsva);
        debouncedOnChangeEnd([color.rgb.r, color.rgb.g, color.rgb.b]);
      }}
    />
  );
}
