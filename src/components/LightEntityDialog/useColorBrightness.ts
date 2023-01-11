import { HassEntity } from "home-assistant-js-websocket";
import { RGB } from "../../utils/general";
import { adjustColorBrightness, setRgbWColor } from "../../utils/light";

export function useColorBrightness({
  currentRGB,
  entity,
}: {
  currentRGB: number[] | undefined;
  entity: HassEntity;
}) {
  const value = currentRGB
    ? Math.round((Math.max(...currentRGB.slice(0, 3)) * 100) / 255)
    : undefined;

  function onChange(nextRawValue: number) {
    const oldValue = value;
    const nextValue = (nextRawValue * 255) / 100;
    const rgb = (currentRGB?.slice(0, 3) || [255, 255, 255]) as RGB;

    setRgbWColor(
      entity,
      adjustColorBrightness(
        // first normalize the value
        oldValue
          ? adjustColorBrightness(rgb, (oldValue * 255) / 100, true)
          : rgb,
        nextValue
      )
    );
  }

  return { value, onChange };
}
