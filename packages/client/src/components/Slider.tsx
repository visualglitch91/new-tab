import { Slider as MuiSlider } from "@mui/material";

function noop() {}

function parseValue(value: number | number[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function Slider({
  min,
  max,
  value,
  defaultValue,
  onChange = noop,
  onChangeEnd = noop,
}: {
  min: number;
  max: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
}) {
  return (
    <MuiSlider
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      onChange={(_, value) => onChange(parseValue(value))}
      onChangeCommitted={(_, value) => onChangeEnd(parseValue(value))}
    />
  );
}
