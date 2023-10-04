import { Box } from "@mui/material";
import PageHeader from "./PageHeader";

export default function PageLayout({
  header,
  headerItems,
  children,
  disableShrinkingHeader,
}: {
  header?: React.ReactNode;
  headerItems?: React.ReactNode;
  children: React.ReactNode;
  disableShrinkingHeader?: boolean;
}) {
  return (
    <Box>
      <PageHeader disableShrinking={disableShrinkingHeader} items={headerItems}>
        {header}
      </PageHeader>
      <Box sx={{ p: "16px" }}>{children}</Box>
    </Box>
  );
}
