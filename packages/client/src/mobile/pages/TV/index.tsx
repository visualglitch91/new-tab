import { Box } from "@mui/material";
import TV from "../../../components/TV";
import PageLayout from "../../components/PageLayout";
import MediaCard from "../../../components/MediaCard";
import { useBreakpoint } from "../../../utils/general";

export default function TVPage() {
  const { isMobileExternalDisplay } = useBreakpoint();

  return (
    <PageLayout
      disableShrinkingHeader
      header={
        <Box mt={isMobileExternalDisplay ? "52px" : "16px"} width="100%">
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
