import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import Paper from "./Paper";
import "./ButtonCard.css";

export default function ButtonCard({
  class: className,
  children,
  onClick,
}: {
  class?: string;
  children: ComponentChildren;
  onClick: () => void;
}) {
  return (
    <Paper class={clsx("component__button-card", className)}>
      <button type="button" onClick={onClick}>
        {children}
      </button>
    </Paper>
  );
}
