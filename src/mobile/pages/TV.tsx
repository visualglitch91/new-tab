import { Box } from "@mui/material";
import TV from "$app/components/TV";
import MediaCard from "$app/components/MediaCard";
import PageLayout from "$app/mobile/components/PageLayout";
import { useBreakpoint } from "$app/utils/general";

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
