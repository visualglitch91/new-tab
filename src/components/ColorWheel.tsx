import { useEffect, useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { useDebouncedCallback, rgbToHex, RGB } from "../utils/general";

export default function ColorWheel({
  selected = [255, 255, 255],
  onChangeEnd,
}: {
  selected?: RGB;
  onChangeEnd: (color: RGB) => void;
}) {
  const [internal, setInternal] = useState(selected);
  const debouncedOnChangeEnd = useDebouncedCallback(onChangeEnd);
  const color = rgbToHex(internal);

  useEffect(() => {
    setInternal(selected);
  }, [selected]);

  return (
    <Wheel
      color={color}
      onChange={(color) => {
        const rgb = [color.rgb.r, color.rgb.g, color.rgb.b] as RGB;
        setInternal(rgb);
        debouncedOnChangeEnd(rgb);
      }}
    />
  );
}
