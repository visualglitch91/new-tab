import { ReactNode } from "react";
import { Box, styled } from "@mui/material";
import AutoGrid from "./AutoGrid";
import SectionTitle from "./SectionTitle";

const Title = styled(SectionTitle)({ marginBottom: "16px" });

export default function GridSection({
  gap = 12,
  columnWidth = 80,
  title,
  children,
  prepend,
}: {
  gap?: number;
  columnWidth?: number;
  title?: string;
  children: ReactNode;
  prepend?: ReactNode;
}) {
  return (
    <div>
      {title && <Title>{title}</Title>}
      {prepend && <Box mb={`${gap * 1.5}px`}>{prepend}</Box>}
      <AutoGrid gap={gap} columnWidth={columnWidth}>
        {children}
      </AutoGrid>
    </div>
  );
}
