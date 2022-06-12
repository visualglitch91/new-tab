import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import "./FlexRow.css";

export default function FlexRow({
  class: className,
  align = "center",
  children,
}: {
  class?: string;
  align?: "left" | "center" | "right";
  children: ComponentChildren;
}) {
  return (
    <div
      class={clsx(
        "component__flex-row",
        align === "left" && "component__flex-row--left",
        align === "right" && "component__flex-row--right",
        className
      )}
    >
      {children}
    </div>
  );
}
