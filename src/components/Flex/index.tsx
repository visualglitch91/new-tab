import { Box, BoxProps } from "@mui/material";

interface FlexProps extends BoxProps {
  column?: boolean;
  justify?: BoxProps["justifyContent"];
  align?: BoxProps["alignItems"];
  gap?: BoxProps["gap"];
  wrap?: BoxProps["flexWrap"];
}

export default function Flex({
  column,
  justify = "flex-start",
  align = "stretch",
  gap = 0,
  wrap = "nowrap",
  children,
  ...rest
}: FlexProps) {
  return (
    <Box
      flexDirection={column ? "column" : "row"}
      justifyContent={justify}
      alignItems={align}
      gap={gap}
      flexWrap={wrap}
      {...rest}
      display="flex"
    >
      {children}
    </Box>
  );
}
