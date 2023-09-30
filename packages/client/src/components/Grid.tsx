import { ReactNode } from "react";
import { SxProps } from "@mui/joy/styles/types";
import BaseDiv from "./BaseDiv";
import { sxx } from "../utils/styles";

export default function Grid({
  gap,
  columnWidth,
  rowHeight,
  className,
  sx,
  children,
}: {
  gap: number;
  columnWidth: number;
  rowHeight?: number;
  sx?: SxProps;
  className?: string;
  children: ReactNode;
}) {
  return (
    <BaseDiv
      sx={sxx(
        {
          display: "grid",
          justifyContent: "center",
          gridGap: `${gap}px`,
          gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidth}px, 1fr))`,
          gridAutoRows: rowHeight ? `${rowHeight}px` : "unset",
        },
        sx
      )}
      className={className}
    >
      {children}
    </BaseDiv>
  );
}
