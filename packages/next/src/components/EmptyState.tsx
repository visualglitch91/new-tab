import { CircularProgress, Stack, SxProps } from "@mui/material";
import { sxx } from "../utils/styling";

export default function EmptyState({
  text,
  loading,
  sx,
}: {
  text: string;
  loading?: boolean;
  sx?: SxProps;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={sxx({ fontSize: 14, padding: "8px" }, sx)}
    >
      {loading ? <CircularProgress /> : text}
    </Stack>
  );
}
