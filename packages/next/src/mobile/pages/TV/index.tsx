import { Box } from "@mui/material";
import TV from "../../../components/TV";
import PageLayout from "../../components/PageLayout";
import MediaCard from "../../../components/MediaCard";

export default function TVPage() {
  return (
    <PageLayout
      disableShrinkingHeader
      header={
        <Box mt="16px">
          <MediaCard />
        </Box>
      }
    >
      <Box mt="8px">
        <TV noMediCard />
      </Box>
    </PageLayout>
  );
}
