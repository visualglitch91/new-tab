import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import "./Stack.css";

export default function Stack({
  class: _className,
  className,
  horizontal,
  smallGap,
  children,
}: {
  class?: string;
  className?: string;
  horizontal?: boolean;
  smallGap?: boolean;
  children: ComponentChildren;
}) {
  return (
    <div
      class={clsx(
        "component__stack",
        `component__stack--${horizontal ? "horizontal" : "vertical"}`,
        smallGap && "component__stack--small-gap",
        _className,
        className
      )}
    >
      {children}
    </div>
  );
}
