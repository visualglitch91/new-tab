import { clsx } from "../utils/general";
import Paper from "./Paper";
import "./TitleCard.css";

export default function TitleCard({
  className,
  title,
  action,
}: {
  className?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <Paper className={clsx("component__title-card", className)}>
      <h2>{title}</h2>
      {action}
    </Paper>
  );
}
