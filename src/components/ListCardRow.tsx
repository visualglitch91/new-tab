import { clsx } from "../utils/general";
import Icon from "./Icon";
import "./ListCardRow.css";

export default function ListCardRow({
  icon,
  label,
  children,
  disabled,
  onIconClick,
}: {
  icon?: string;
  children: React.ReactNode;
  label?: React.ReactNode;
  disabled?: boolean;
  onIconClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <div
      className={clsx(
        "component__list-card-row",
        disabled && "component__list-card-row--disabled"
      )}
    >
      {icon && (
        <div
          className={clsx(
            "component__list-card-row__icon-wrapper",
            onIconClick && "component__list-card-row__icon-wrapper--has-click"
          )}
          onClick={onIconClick}
        >
          <Icon icon={icon} />
        </div>
      )}
      <div className="component__list-card-row__label">{label}</div>
      <div>{children}</div>
    </div>
  );
}
