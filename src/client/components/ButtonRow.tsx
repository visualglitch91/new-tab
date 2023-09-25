import { sxx } from "../utils/styles";
import BaseDiv, { BaseDivProps } from "./BaseDiv";

export default function ButtonRow({
  sx,
  height,
  ...props
}: BaseDivProps & {
  height?: number;
}) {
  return (
    <BaseDiv
      {...props}
      sx={sxx(
        height && { height: `${height}px` },
        {
          width: "100%",
          display: "flex",
          gridGap: "8px",
          "& > *": { flex: 1, overflow: "hidden" },
        },
        sx
      )}
    />
  );
}
