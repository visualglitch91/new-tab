import { ReactNode } from "react";

export default function Grid({
  gap,
  columnWidth,
  rowHeight,
  className,
  children,
}: {
  gap: number;
  columnWidth: number;
  rowHeight?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        justifyContent: "center",
        gridGap: `${gap}px`,
        gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidth}px, 1fr))`,
        gridAutoRows: rowHeight ? `${rowHeight}px` : "unset",
      }}
    >
      {children}
    </div>
  );
}
