import { Box } from "@mui/material";
import PageHeader, { PageHeaderProps } from "./PageHeader";

export default function PageLayout({
  header,
  headerItems,
  children,
  shrinkingHeader,
}: {
  header?: React.ReactNode;
  headerItems?: React.ReactNode;
  children: React.ReactNode;
  shrinkingHeader?: PageHeaderProps["shrinking"];
}) {
  return (
    <Box>
      <PageHeader shrinking={shrinkingHeader} items={headerItems}>
        {header}
      </PageHeader>
      <Box sx={{ p: "16px" }}>{children}</Box>
    </Box>
  );
}
