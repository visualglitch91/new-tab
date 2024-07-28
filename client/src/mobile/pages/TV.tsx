import { Box } from "@mui/material";
import TV from "$client/components/TV";
import MediaCard from "$client/components/MediaCard";
import PageLayout from "$client/mobile/components/PageLayout";
import { useBreakpoint } from "$client/utils/general";

export default function TVPage() {
  const { isMobileExternalDisplay } = useBreakpoint();

  return (
    <PageLayout
      shrinkingHeader="disable"
      header={
        <Box mt={isMobileExternalDisplay ? "52px" : "16px"} width="100%">
          <MediaCard />
        </Box>
      }
    >
      <Box mt="8px">
        <TV />
      </Box>
    </PageLayout>
  );
}
