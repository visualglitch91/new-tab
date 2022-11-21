import { clsx } from "../utils/general";
import Icon from "./Icon";
import "./PillButton.css";

export default function PillButton({
  className,
  icon,
  label,
  onClick,
}: {
  className?: string;
  icon?: string;
  label?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={clsx("component__pill-button", className)}
      onClick={onClick}
    >
      {icon && <Icon size={14} icon={icon} />}
      {label}
    </button>
  );
}
