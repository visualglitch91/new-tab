import { ListItem, Stack, ButtonGroup, styled } from "@mui/material";
import { Schedule } from "$common/types/hass-scheduler";
import DaysRow from "../DaysRow";
import { formatTime } from "./utils";
import Icon from "../Icon";
import AltIconButton from "../AltIconButton";

const Title = styled("div")({
  flex: 1,
  fontWeight: 600,
  '&[data-disabled="true"]': {
    textDecoration: "line-through",
  },
});

const Time = styled("div")({
  fontWeight: 600,
  marginLeft: "auto",
});

export default function ScheduleItem({
  schedule,
  onPatch,
  onEdit,
  onDelete,
  onRunNow,
}: {
  schedule: Schedule;
  onPatch: <K extends keyof Schedule>(key: K, value: Schedule[K]) => void;
  onEdit: () => void;
  onDelete: () => void;
  onRunNow: () => void;
}) {
  const options = [
    {
      label: schedule.enabled ? "Desativar" : "Ativar",
      primary: !schedule.enabled,
      value: "toggle",
      icon: schedule.enabled
        ? "mdi:checkbox-marked-circle-outline"
        : "checkbox-blank-circle-outline",
      action: () => onPatch("enabled", !schedule.enabled),
    },
    {
      label: "Editar",
      value: "edit",
      icon: "pencil-outline",
      action: onEdit,
    },
    {
      label: "Executar Agora",
      value: "play",
      icon: "play",
      action: onRunNow,
    },
    {
      label: "Deletar",
      value: "delete",
      icon: "close",
      action: onDelete,
    },
  ];

  return (
    <ListItem sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Stack direction="row" spacing={2} width="100%" alignItems="center">
        <ButtonGroup
          sx={{ "& .MuiButtonGroup-grouped": { minWidth: "unset" } }}
        >
          {options.map((it, index) => (
            <AltIconButton
              size={26}
              iconSize={14}
              icon={it.icon}
              key={index}
              onClick={it.action}
            />
          ))}
        </ButtonGroup>
        <Title data-disabled={!schedule.enabled}>{schedule.name}</Title>
        <Time>{formatTime(schedule.time)}</Time>
      </Stack>
      <DaysRow
        value={schedule.days}
        onChange={(value) => onPatch("days", value)}
      />
    </ListItem>
  );
}
