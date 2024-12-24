import { ReactNode } from "react";
import { Box, Grid2, styled } from "@mui/material";
import SectionTitle from "./SectionTitle";

const Title = styled(SectionTitle)({ marginBottom: "16px" });

export interface GridSectionProps {
  title?: string;
  defaultSize?: number;
  prepend?: ReactNode;
  items: (React.ReactElement | { element: React.ReactNode; size?: number })[];
}

export default function EntityTileGridSection({
  title,
  prepend,
  defaultSize = 2,
  items,
}: GridSectionProps) {
  return (
    <div>
      {title && <Title>{title}</Title>}
      {prepend && <Box mb={1.5}>{prepend}</Box>}

      <Grid2 container spacing={1}>
        {items.map((item, i) => {
          if (typeof item !== "object") {
            return null;
          }

          const element = "element" in item ? item.element : item;
          const size = ("element" in item && item.size) || defaultSize;

          return (
            <Grid2 key={i} size={size} data-size={size}>
              {element}
            </Grid2>
          );
        })}
      </Grid2>
    </div>
  );
}
