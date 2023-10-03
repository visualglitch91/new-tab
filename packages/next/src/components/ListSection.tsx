import { ReactNode } from "react";
import { List, Stack } from "@mui/material";
import SectionTitle from "./SectionTitle";
import GlossyPaper from "./GlossyPaper";

export default function ListSection({
  title,
  children,
}: {
  title: ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Stack spacing={2}>
      <SectionTitle>{title}</SectionTitle>
      <List component={GlossyPaper}>{children}</List>
    </Stack>
  );
}
