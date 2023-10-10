import { ScheduledTask, UnscheduledTask } from "@home-control/types/ticktick";
import ListSection from "../ListSection";
import TaskItem from "./TaskItem";

export default function Tasks({
  title,
  items,
  requestRefetch,
}: {
  title: React.ReactNode;
  items: (ScheduledTask | UnscheduledTask)[];
  requestRefetch: () => void;
}) {
  return (
    <ListSection title={title}>
      {items.map((item) => (
        <TaskItem key={item.id} task={item} requestRefetch={requestRefetch} />
      ))}
    </ListSection>
  );
}
