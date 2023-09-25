import { sxx } from "../utils/styles";
import BaseDiv, { type BaseDivProps } from "./BaseDiv";

const styles = {
  wrapper: {
    display: "flex",
    gridGap: "8px",
    justifyContent: "center",
    alignItems: "center",
  },
  full: { width: "100%" },
  wrap: { flexWrap: "wrap" },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },
};

export default function FlexRow({
  sx,
  align = "center",
  wrap,
  full,
  ...props
}: BaseDivProps & {
  align?: "left" | "center" | "right";
  wrap?: boolean;
  full?: boolean;
}) {
  return (
    <BaseDiv
      {...props}
      sx={sxx(
        styles.wrapper,
        align === "left" && styles.left,
        align === "right" && styles.right,
        wrap && styles.wrap,
        full && styles.full,
        sx
      )}
    />
  );
}
