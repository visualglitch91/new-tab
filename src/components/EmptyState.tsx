import { CircularProgress, Stack, SxProps } from "@mui/material";
import { sxx } from "$app/utils/styling";

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
      sx={sxx({ fontSize: 14, padding: "16px", fontWeight: 500 }, sx)}
    >
      {loading ? <CircularProgress /> : text}
    </Stack>
  );
}
