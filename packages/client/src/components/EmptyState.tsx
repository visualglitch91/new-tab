import { CircularProgress } from "@mui/joy";
import FlexRow from "./FlexRow";

export default function EmptyState({
  text,
  loading,
}: {
  text: string;
  loading?: boolean;
}) {
  return (
    <FlexRow sx={{ fontSize: 14, padding: "8px" }}>
      {loading ? <CircularProgress /> : text}
    </FlexRow>
  );
}
