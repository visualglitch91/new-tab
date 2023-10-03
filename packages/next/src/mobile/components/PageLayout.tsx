import { Box } from "@mui/material";
import PageHeader from "./PageHeader";

export default function PageLayout({
  header,
  headerItems,
  children,
}: {
  header?: React.ReactNode;
  headerItems?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Box>
      {header && <PageHeader items={headerItems}>{header}</PageHeader>}
      <Box sx={{ p: "16px" }}>{children}</Box>
    </Box>
  );
}
