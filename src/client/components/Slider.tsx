import { Slider as JoySlider } from "@mui/joy";

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
    <JoySlider
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      onChange={(_, value) => onChange(parseValue(value))}
      onChangeCommitted={(_, value) => onChangeEnd(parseValue(value))}
    />
  );
}
