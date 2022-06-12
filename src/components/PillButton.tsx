import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import Icon from "./Icon";
import "./PillButton.css";

export default function PillButton({
  class: className,
  icon,
  label,
  onClick,
}: {
  class?: string;
  icon?: string;
  label?: ComponentChildren;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      class={clsx("component__pill-button", className)}
      onClick={onClick}
    >
      {icon && <Icon size={14} icon={icon} />}
      {label}
    </button>
  );
}
