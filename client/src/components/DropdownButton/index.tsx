import { useMenu } from "$client/utils/useMenu";
import { Button } from "@mui/material";

export default function DropdownButton<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const showMenu = useMenu();
  const label = options.find((it) => it.value === value)?.value || "Select";

  return (
    <Button
      size="small"
      onClick={(e) => {
        showMenu({
          mouseEvent: e.nativeEvent,
          clickAnchor: true,
          title: "Opções",
          options: options.map((it) => ({
            label: it.label,
            onClick: () => onChange(it.value),
          })),
        });
      }}
    >
      {label}
    </Button>
  );
}
