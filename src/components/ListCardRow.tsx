import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import Icon from "./Icon";
import "./ListCardRow.css";
import { JSXInternal } from "preact/src/jsx";

export default function ListCardRow({
  icon,
  label,
  children,
  disabled,
  onIconClick,
}: {
  icon?: string;
  children: ComponentChildren;
  label?: string;
  disabled?: boolean;
  onIconClick?: (e: JSXInternal.TargetedMouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      class={clsx(
        "component__list-card-row",
        disabled && "component__list-card-row--disabled"
      )}
    >
      {icon && (
        <div
          class={clsx(
            "component__list-card-row__icon-wrapper",
            onIconClick && "component__list-card-row__icon-wrapper--has-click"
          )}
          onClick={onIconClick}
        >
          <Icon icon={icon} />
        </div>
      )}
      <div class="component__list-card-row__label">{label}</div>
      <div>{children}</div>
    </div>
  );
}
