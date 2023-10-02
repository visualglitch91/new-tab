import { SxProps } from "@mui/joy/styles/types";
import { forwardRef } from "react";
import { sxx } from "../utils/styles";
import BaseDiv from "./BaseDiv";

const styles = {
  wrapper: {
    display: "flex",
    gap: "16px",
  },
  horizontal: {
    flexDirection: "row",
    alignItems: "flex-start",
    "& > *": { flex: 1 },
  },
  vertical: { flexDirection: "column" },
  smallGap: { gap: "8px" },
  largeGap: { gap: "32px" },
};

const Stack = forwardRef(function Stack(
  {
    horizontal,
    smallGap,
    largeGap,
    sx,
    ...props
  }: {
    sx?: SxProps;
    className?: string;
    horizontal?: boolean;
    smallGap?: boolean;
    largeGap?: boolean;
    children: React.ReactNode;
  },
  ref: React.Ref<HTMLDivElement>
) {
  return (
    <BaseDiv
      {...props}
      ref={ref}
      sx={sxx(
        styles.wrapper,
        horizontal && styles.horizontal,
        !horizontal && styles.vertical,
        smallGap && styles.smallGap,
        largeGap && styles.largeGap,
        sx
      )}
    />
  );
});

export default Stack;
