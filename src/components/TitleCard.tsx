import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import Paper from "./Paper";
import "./TitleCard.css";

export default function TitleCard({
  class: className,
  title,
  action,
}: {
  class?: string;
  title: string;
  action?: ComponentChildren;
}) {
  return (
    <Paper class={clsx("component__title-card", className)}>
      <h2>{title}</h2>
      {action}
    </Paper>
  );
}
