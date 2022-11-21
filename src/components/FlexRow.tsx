import { clsx } from "../utils/general";
import "./FlexRow.css";

export default function FlexRow({
  className,
  align = "center",
  children,
}: {
  className?: string;
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
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
