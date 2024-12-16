import { Box, alpha } from "@mui/material";
import { SxProps } from "$app/theme/utils";
import { sxx } from "$app/utils/styling";

export default function ColorBadge({
  color = "#222222",
  radius = "100%",
  size = 10,
  border = false,
  sx,
}: {
  color: string;
  size?: number | string;
  radius?: number | string;
  border?: boolean;
  sx?: SxProps;
}) {
  return (
    <Box
      sx={sxx(
        {
          display: "inline-block",
          width: size,
          height: size,
          borderRadius: radius,
          background: alpha(color, 0.9),
          boxSizing: "border-box",
          border: border ? "1px solid rgba(0, 0, 0, 0.1)" : undefined,
        },
        sx
      )}
    />
  );
}
