import { Button, ButtonGroup, alpha } from "@mui/material";
import { Schedule } from "$common/types/hass-scheduler";

const days: { value: keyof Schedule["days"]; label: string }[] = [
  { value: "sunday", label: "Dom" },
  { value: "monday", label: "Seg" },
  { value: "tuesday", label: "Ter" },
  { value: "wednesday", label: "Qua" },
  { value: "thursday", label: "Qui" },
  { value: "friday", label: "Sex" },
  { value: "saturday", label: "Sab" },
];

export default function DaysRow({
  value,
  onChange,
}: {
  value: Schedule["days"];
  onChange: (value: Schedule["days"]) => void;
}) {
  return (
    <ButtonGroup
      sx={(theme) => ({
        width: "100%",
        "& .MuiButton-root": {
          flex: 1,
          [theme.breakpoints.down("sm")]: {
            "& > *:nth-child(2)": { display: "none" },
          },
          "&.MuiButton-containedPrimary": {
            color: "white !important",
            backgroundColor: alpha(theme.palette.primary.main, 0.7),
          },
          "&.MuiButton-containedPrimary:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.9),
          },
        },
      })}
    >
      {days.map((it) => (
        <Button
          key={it.value}
          color={value[it.value] ? "secondary" : "secondary"}
          variant={value[it.value] ? "contained" : "outlined"}
          onClick={() => {
            onChange({
              ...value,
              [it.value]: !value[it.value],
            });
          }}
        >
          <span>{it.label.charAt(0)}</span>
          <span>{it.label.substring(1, 3)}</span>
        </Button>
      ))}
    </ButtonGroup>
  );
}
