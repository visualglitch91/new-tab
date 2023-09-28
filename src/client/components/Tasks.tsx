import { differenceInCalendarDays, format } from "date-fns";
import { ScheduledTask, UnscheduledTask } from "../../types/ticktick";
import ListCard from "./ListCard";
import api from "../utils/api";
import { useConfirm } from "../utils/useConfirm";
import TaskList from "./TaskList";

const today = new Date();

const colors = {
  past: "#ff5555",
  today: "#50fa7b",
  later: "unset",
};

function DueDate({ date }: { date: Date }) {
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
        : format(date, "MMM d")}
    </span>
  );
}

export default function Tasks({
  title,
  items,
  requestRefresh,
}: {
  title: string;
  items: (ScheduledTask | UnscheduledTask)[];
  requestRefresh: () => void;
}) {
  const [confirm, modals] = useConfirm();

  return (
    <>
      {modals}
      <ListCard title={title}>
        <TaskList
          items={items.map((item) => ({
            title: item.title,
            subtitle:
              "dueDate" in item ? (
                <DueDate date={new Date(item.dueDate)} />
              ) : undefined,
            click:
              "projectId" in item
                ? () => {
                    confirm({
                      title: "Completar?",
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
      </ListCard>
    </>
  );
}
