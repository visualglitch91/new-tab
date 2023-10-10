import { get } from "lodash";
import { format, differenceInCalendarDays } from "date-fns";
import { Box, Stack, alpha } from "@mui/material";
import { ScheduledTask, UnscheduledTask } from "@home-control/types/ticktick";
import api from "../../utils/api";
import useConfirm from "../../utils/useConfirm";
import ListItem from "../ListItem";
import Icon from "../Icon";

function isEventCurrentlyHappening(startDate: Date, endDate: Date) {
  const now = new Date();
  return now >= startDate && now <= endDate;
}

const colors = {
  allDay: "#8be9fd",
  current: "#ffb86c",
  delayed: "#ff5555",
  none: "#bbbbbb",
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
          <Box
            sx={{
              backgroundColor: alpha(colors[colorKey], 0.3),
              padding: "3px 8px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {isDelayed
              ? "Atrasada"
              : isAllDay
              ? "Dia Todo"
              : `${format(dates.start, "HH:mm")} - ${format(
                  dates.end,
                  "HH:mm"
                )}`}
          </Box>
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
