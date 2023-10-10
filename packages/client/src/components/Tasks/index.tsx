import {
  parse,
  format,
  isWithinInterval,
  differenceInCalendarDays,
} from "date-fns";
import { groupBy, sortBy } from "lodash";
import { ListSubheader } from "@mui/material";
import { ScheduledTask, UnscheduledTask } from "@home-control/types/ticktick";
import api from "../../utils/api";
import { formatDate } from "../../utils/general";
import useConfirm from "../../utils/useConfirm";
import ListSection from "../ListSection";
import TaskList from "./TaskList";
import { getTodayAndTomorrowEvents } from "./utils";

const colors = {
  past: "#ff5555",
  today: "#50fa7b",
  later: "unset",
};

function DueDate({ date }: { date: Date }) {
  const today = new Date();
  const diff = differenceInCalendarDays(date, today);
  const className = diff < 0 ? "past" : diff === 0 ? "today" : "later";

  return (
    <span style={{ color: colors[className] }}>
      {diff === -1
        ? "Ontem"
        : diff === 0
        ? "Hoje"
        : diff === 1
        ? "Amanhã"
        : formatDate(date)}
    </span>
  );
}

export default function Tasks({
  title,
  items: grouped,
  requestRefresh,
}: {
  title: string;
  items: [string, (ScheduledTask | UnscheduledTask)[]][];
  requestRefresh: () => void;
}) {
  const confirm = useConfirm();

  return (
    <ListSection title={title}>
      <div style={{ maxHeight: 600, overflow: "auto" }}>
        {grouped.map(
          ([key, items]) =>
            items.length > 0 && (
              <li key={key}>
                <ul style={{ padding: 0 }}>
                  {key !== "unscheduled" && (
                    <ListSubheader>{key}</ListSubheader>
                  )}
                  <TaskList
                    items={items.map((item) => ({
                      title: item.title,
                      subtitle:
                        "startDate" in item
                          ? item.isAllDay
                            ? "Dia Todo"
                            : `${format(
                                new Date(item.startDate),
                                "HH:mm"
                              )} - ${format(new Date(item.endDate), "HH:mm")}`
                          : undefined,
                      click:
                        "projectId" in item
                          ? () => {
                              confirm({
                                title: "Completar?",
                                confirmLabel: "Sim",
                                onConfirm: () => {
                                  api("/ticktick/tasks/complete", "POST", {
                                    id: item.id,
                                    projectId: item.projectId,
                                  }).then(() => {
                                    requestRefresh();
                                  });
                                },
                              });
                            }
                          : undefined,
                      href: !("projectId" in item)
                        ? `https://ticktick.com/webapp/#q/all/week/${item.id}`
                        : undefined,
                    }))}
                  />
                </ul>
              </li>
            )
        )}
      </div>
    </ListSection>
  );
}
