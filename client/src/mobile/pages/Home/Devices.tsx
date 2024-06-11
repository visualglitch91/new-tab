import { Stack } from "@mui/material";
import HomeDevices from "$client/components/HomeDevices";
import PageLayout from "$client/mobile/components/PageLayout";

export default function Devices() {
  return (
    <PageLayout shrinkingHeader="disable">
      <Stack spacing={5}>
        <HomeDevices />
      </Stack>
    </PageLayout>
  );
}
