import { ReactNode } from "react";
import { List } from "@mui/material";
import GlossyPaper from "./GlossyPaper";
import Section from "./Section";

export default function ListSection({
  title,
  children,
}: {
  title: ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Section title={title}>
      <List component={GlossyPaper}>{children}</List>
    </Section>
  );
}
