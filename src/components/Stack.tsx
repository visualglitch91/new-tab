import { clsx } from "../utils/general";
import "./Stack.css";

export default function Stack({
  nodeRef,
  className,
  horizontal,
  smallGap,
  children,
  title,
}: {
  nodeRef?: React.LegacyRef<HTMLDivElement>;
  className?: string;
  horizontal?: boolean;
  smallGap?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div
      title={title}
      ref={nodeRef}
      className={clsx(
        "component__stack",
        `component__stack--${horizontal ? "horizontal" : "vertical"}`,
        smallGap && "component__stack--small-gap",
        className
      )}
    >
      {children}
    </div>
  );
}
