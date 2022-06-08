import { clsx } from "../utils/general";
import MaterialIcon from "./MaterialIcon";
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
      {icon && <MaterialIcon icon={icon} />}
      {label}
    </button>
  );
}
