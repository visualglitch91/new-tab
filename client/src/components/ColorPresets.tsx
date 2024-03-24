import { styled, Stack, ButtonBase } from "@mui/material";
import {
  RGB,
  colorPresets,
  isColorEqual,
  getContrastColor,
  getDisplayColorString,
} from "$client/utils/colors";
import Icon from "./Icon";
import ColorBadge from "./ColorBadge";

const ColorPresetButton = styled(ButtonBase)({
  padding: 0,
  outline: "none",
  border: 0,
  fontSize: 0,
  background: "transparent",
  cursor: "pointer",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "& > i": {
    position: "absolute",
    left: "calc(50%- 12px)",
    top: "calc(50%- 12px)",
  },
});

export default function ColorPresets({
  radius = 4,
  size = 42,
  selected,
  onChange,
}: {
  selected?: RGB;
  radius?: number;
  size?: number;
  onChange: (color: RGB) => void;
}) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={2}>
      {colorPresets.map((color, index) => (
        <ColorPresetButton key={index} onClick={() => onChange(color)}>
          {selected && isColorEqual(selected, color) && (
            <Icon
              size={24}
              icon="check"
              style={{ color: getContrastColor(color) }}
            />
          )}
          <ColorBadge
            radius={radius}
            size={size}
            color={getDisplayColorString(color)}
          />
        </ColorPresetButton>
      ))}
    </Stack>
  );
}
