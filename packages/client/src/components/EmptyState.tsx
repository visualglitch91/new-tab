import { CircularProgress } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import FlexRow from "./FlexRow";
import { sxx } from "../utils/styles";

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
    <FlexRow sx={sxx({ fontSize: 14, padding: "8px" }, sx)}>
      {loading ? <CircularProgress /> : text}
    </FlexRow>
  );
}
