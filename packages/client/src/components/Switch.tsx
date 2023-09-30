import { Switch as JoySwitch } from "@mui/joy";

export default function Switch({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
}) {
  return (
    <JoySwitch checked={checked} disabled={disabled} onChange={onChange} />
  );
}
