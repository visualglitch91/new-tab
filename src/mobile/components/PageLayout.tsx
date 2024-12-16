import { Box } from "@mui/material";
import { SxProps } from "$app/theme/utils";
import PageHeader, { PageHeaderProps } from "./PageHeader";
import { sxx } from "$app/utils/styling";

export default function PageLayout({
  header,
  headerItems,
  children,
  shrinkingHeader,
  sx,
}: {
  header?: React.ReactNode;
  headerItems?: React.ReactNode;
  children: React.ReactNode;
  shrinkingHeader?: PageHeaderProps["shrinking"];
  sx?: SxProps;
}) {
  return (
    <Box>
      <PageHeader shrinking={shrinkingHeader} items={headerItems}>
        {header}
      </PageHeader>
      <Box sx={sxx({ p: "16px" }, sx)}>{children}</Box>
    </Box>
  );
}
