import { ScheduledTask, UnscheduledTask } from "@home-control/types/ticktick";
import { SxProps } from "../../theme/utils";
import ListSection from "../ListSection";
import EmptyState from "../EmptyState";
import TaskItem from "./TaskItem";

export default function Tasks({
  sx,
  title,
  items,
}: {
  sx?: SxProps;
  title: React.ReactNode;
  items: (ScheduledTask | UnscheduledTask)[];
}) {
  return (
    <ListSection sx={sx} title={title}>
      {items.length === 0 ? (
        <EmptyState text="Nenhum evento ou tarefa" />
      ) : (
        items.map((item) => <TaskItem key={item.id} task={item} />)
      )}
    </ListSection>
  );
}
