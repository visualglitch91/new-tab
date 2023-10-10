import { ScheduledTask, UnscheduledTask } from "@home-control/types/ticktick";
import ListSection from "../ListSection";
import TaskItem from "./TaskItem";
import { SxProps } from "../../theme/utils";

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
      {items.map((item) => (
        <TaskItem key={item.id} task={item} />
      ))}
    </ListSection>
  );
}
