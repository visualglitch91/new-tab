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
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      class={clsx("component__pill-button", className)}
      onClick={onClick}
    >
      {icon && <Icon icon={icon} />}
      {label}
    </button>
  );
}
