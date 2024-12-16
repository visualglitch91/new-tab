import { ReactNode } from "react";
import { List } from "@mui/material";
import { SxProps } from "$app/theme/utils";
import GlossyPaper from "./GlossyPaper";
import Section from "./Section";

export default function ListSection({
  sx,
  title,
  children,
}: {
  sx?: SxProps;
  title: ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Section sx={sx} title={title}>
      <List component={GlossyPaper}>{children}</List>
    </Section>
  );
}
