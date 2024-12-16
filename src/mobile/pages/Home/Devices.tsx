import { Stack } from "@mui/material";
import HomeDevices from "$app/components/HomeDevices";
import PageLayout from "$app/mobile/components/PageLayout";

export default function Devices() {
  return (
    <PageLayout shrinkingHeader="disable">
      <Stack spacing={5}>
        <HomeDevices />
      </Stack>
    </PageLayout>
  );
}
