import { getContrastColor, RGB } from "../utils/general";
import { colorPresets, isColorEqual } from "../utils/colorPresets";
import Icon from "./Icon";
import FlexRow from "./FlexRow";
import ColorBadge from "./ColorBadge";
import "./ColorPresets.css";

export default function ColorPresets({
  class: className,
  radius = 4,
  size = 42,
  selected,
  onChange,
}: {
  class?: string;
  selected?: RGB;
  radius?: number;
  size?: number;
  onChange: (color: RGB) => void;
}) {
  return (
    <FlexRow class={className}>
      {colorPresets.map((color, index) => (
        <button
          key={index}
          class="component__color-presets__button"
          onClick={() => onChange(color)}
        >
          {selected && isColorEqual(selected, color) && (
            <Icon
              size={24}
              icon="check"
              style={{ color: getContrastColor(color) }}
            />
          )}
          <ColorBadge radius={radius} size={size} color={color} />
        </button>
      ))}
    </FlexRow>
  );
}
