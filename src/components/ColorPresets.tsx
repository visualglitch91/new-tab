import { getContrastColor, RGB } from "../utils/general";
import { colorPresets } from "../utils/colorPresets";
import Icon from "./Icon";
import FlexRow from "./FlexRow";
import ColorBadge from "./ColorBadge";
import "./ColorPresets.css";

export default function ColorPresets({
  class: className,
  selected,
  onChange,
}: {
  class?: string;
  selected?: RGB;
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
          {selected && selected.join(",") === color.join(",") && (
            <Icon
              size={24}
              icon="check"
              style={{ color: getContrastColor(color) }}
            />
          )}
          <ColorBadge size={42} color={color} />
        </button>
      ))}
    </FlexRow>
  );
}
