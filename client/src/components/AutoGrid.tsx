import { ReactNode } from "react";
import { Box, SxProps } from "@mui/material";
import { sxx } from "$client/utils/styling";

export default function AutoGrid({
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
    <Box
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
    </Box>
  );
}
