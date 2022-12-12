import { useEffect, useRef } from "react";
import { css, styled, theme } from "../styling";

const Root = styled("div", css``);

const Label = styled(
  "label",
  css`
    display: block;
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 4px;
  `
);

const TextInput = styled(
  "input",
  css`
    font-family: inherit;
    font-size: 12px;
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid ${theme.accent.base};
    background-color: transparent;
    color: ${theme.accent.base};
    width: 100%;
    outline: none;

    &:hover,
    &:focus {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `
);

export default function TextField({
  label,
  value,
  autoFocus,
  onChange,
}: {
  label: string;
  value: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      ref.current?.focus();
    }
  }, [autoFocus]);

  return (
    <Root>
      <Label htmlFor={label}>{label}</Label>
      <TextInput
        ref={ref}
        id={label}
        name={label}
        type="text"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </Root>
  );
}
