import { ReactNode } from "react";
import { styled } from "@mui/joy";
import Grid from "./Grid";
import SectionTitle from "./SectionTitle";

const Title = styled(SectionTitle)({ marginBottom: "16px" });

export default function GridSection({
  gap = 12,
  columnWidth = 80,
  title,
  children,
}: {
  gap?: number;
  columnWidth?: number;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {title && <Title>{title}</Title>}
      <Grid gap={gap} columnWidth={columnWidth}>
        {children}
      </Grid>
    </div>
  );
}
