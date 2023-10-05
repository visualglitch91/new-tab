import { Slider as MuiSlider } from "@mui/material";
import { useState } from "react";

function noop() {}

function parseValue(value: number | number[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default function Slider({
  min,
  max,
  value: externalValue,
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
  const [internalValue, setIntervalValue] = useState(defaultValue || 0);
  const value = externalValue || internalValue;

  return (
    <MuiSlider
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      onChange={(_, raw) => {
        const value = parseValue(raw);
        setIntervalValue(value);
        onChange?.(value);
      }}
      onChangeCommitted={(_, value) => {
        onChangeEnd(parseValue(value));
      }}
    />
  );
}
