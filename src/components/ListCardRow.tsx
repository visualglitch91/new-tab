import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import MaterialIcon from "./MaterialIcon";
import "./ListCardRow.css";
import { JSXInternal } from "preact/src/jsx";

export default function ListCardRow({
  icon,
  label,
  children,
  onIconClick,
}: {
  icon?: string;
  label?: string;
  children: ComponentChildren;
  onIconClick?: (e: JSXInternal.TargetedMouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div class="component__list-card-row">
      {icon && (
        <div
          class={clsx(
            "component__list-card-row__icon-wrapper",
            onIconClick && "component__list-card-row__icon-wrapper--has-click"
          )}
          onClick={onIconClick}
        >
          <MaterialIcon icon={icon} />
        </div>
      )}
      <div class="component__list-card-row__label">{label}</div>
      <div>{children}</div>
    </div>
  );
}
