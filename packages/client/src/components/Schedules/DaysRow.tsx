import { Button, ToggleButtonGroup } from "@mui/joy";
import { Schedule } from "@home-control/types/hass-scheduler";
import { useResponsive } from "../../utils/general";
import { alpha } from "../../utils/styles";

const days = [
  { value: "sunday", label: "Dom" },
  { value: "monday", label: "Seg" },
  { value: "tuesday", label: "Ter" },
  { value: "wednesday", label: "Qua" },
  { value: "thursday", label: "Qui" },
  { value: "friday", label: "Sex" },
  { value: "saturday", label: "Sab" },
] as const;

export default function DaysRow({
  value,
  onChange,
}: {
  value: Schedule["days"];
  onChange: (value: Schedule["days"]) => void;
}) {
  const { isMobile } = useResponsive();

  return (
    <ToggleButtonGroup
      size="sm"
      color="primary"
      variant="outlined"
      spacing="0.5rem"
      buttonFlex={1}
      sx={(theme) => ({
        "& .MuiButton-root": {
          fontSize: "13px",
          paddingInline: 0,
          '&[aria-pressed="true"]': {
            backgroundColor: alpha(theme.palette.primary[700], 0.7),
          },
          '&[aria-pressed="true"]:hover': {
            backgroundColor: alpha(theme.palette.primary[700], 0.9),
          },
        },
      })}
      value={Object.keys(value)}
      onChange={
        onChange
          ? (_, value) =>
              onChange(
                value.reduce(
                  (acc, it) => ({ ...acc, [it]: true }),
                  {} as Schedule["days"]
                )
              )
          : undefined
      }
    >
      {days.map((it) => (
        <Button key={it.value} value={it.value}>
          {it.label.substring(0, isMobile ? 1 : 3)}
        </Button>
      ))}
    </ToggleButtonGroup>
  );
}
