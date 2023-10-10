import { get } from "lodash";
import { format, differenceInCalendarDays } from "date-fns";
import { Stack } from "@mui/material";
import { ScheduledTask, UnscheduledTask } from "@home-control/types/ticktick";
import api from "../../utils/api";
import useConfirm from "../../utils/useConfirm";
import ListItem from "../ListItem";
import Icon from "../Icon";
import DraculaChip, { Colors } from "../DraculaChip";

function isEventCurrentlyHappening(startDate: Date, endDate: Date) {
  const now = new Date();
  return now >= startDate && now <= endDate;
}

const colors = {
  allDay: Colors.Purple,
  current: Colors.Pink,
  delayed: Colors.Red,
  none: Colors.Neutral,
} as const;

export default function TaskItem({
  task,
  requestRefetch,
}: {
  task: ScheduledTask | UnscheduledTask;
  requestRefetch: () => void;
}) {
  const confirm = useConfirm();

  const dates =
    "startDate" in task
      ? { start: new Date(task.startDate), end: new Date(task.endDate) }
      : undefined;

  const isCurrent = dates
    ? isEventCurrentlyHappening(dates.start, dates.end)
    : false;

  const isAllDay = "isAllDay" in task ? task.isAllDay : false;

  const isDelayed = dates
    ? differenceInCalendarDays(dates.end, new Date()) < 0
    : false;

  const colorKey = isDelayed
    ? "delayed"
    : isAllDay
    ? "allDay"
    : isCurrent
    ? "current"
    : "none";

  const conferenceLink: string | undefined = get(
    task,
    "raw.conference.entryPoints",
    []
  ).find((it: any) => it.entryPointType === "video")?.uri;

  return (
    <ListItem
      minSize="sm"
      primaryText={
        <Stack direction="row" spacing={1} alignItems="center">
          <span>{task.title}</span>
          {conferenceLink && <Icon size={18} icon="video-outline" />}
        </Stack>
      }
      endSlot={
        dates ? (
          <DraculaChip
            color={colors[colorKey]}
            sx={{ fontSize: "12px" }}
            text={
              isDelayed
                ? "Atrasada"
                : isAllDay
                ? "Dia Todo"
                : `${format(dates.start, "HH:mm")} - ${format(
                    dates.end,
                    "HH:mm"
                  )}`
            }
          />
        ) : undefined
      }
      onClick={() => {
        if ("projectId" in task) {
          confirm({
            title: "Completar?",
            confirmLabel: "Sim",
            onConfirm: () => {
              api("/ticktick/tasks/complete", "POST", {
                id: task.id,
                projectId: task.projectId,
              }).then(() => {
                requestRefetch();
              });
            },
          });
        } else {
          window.open(`https://ticktick.com/webapp/#q/week/tasks/${task.id}`);
        }
      }}
    />
  );
}
