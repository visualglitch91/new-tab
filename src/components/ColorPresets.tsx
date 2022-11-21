import ButtonBase from "@mui/material/ButtonBase";
import { getContrastColor, RGB } from "../utils/general";
import { colorPresets, isColorEqual } from "../utils/colorPresets";
import Icon from "./Icon";
import FlexRow from "./FlexRow";
import ColorBadge from "./ColorBadge";
import "./ColorPresets.css";

export default function ColorPresets({
  className,
  radius = 4,
  size = 42,
  selected,
  onChange,
}: {
  className?: string;
  selected?: RGB;
  radius?: number;
  size?: number;
  onChange: (color: RGB) => void;
}) {
  return (
    <FlexRow className={className}>
      {colorPresets.map((color, index) => (
        <ButtonBase
          key={index}
          className="component__color-presets__button"
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
        </ButtonBase>
      ))}
    </FlexRow>
  );
}
