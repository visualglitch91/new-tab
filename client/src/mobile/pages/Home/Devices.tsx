import { Stack } from "@mui/material";
import HomeDevices from "$client/components/HomeDevices";
import PageLayout from "$client/mobile/components/PageLayout";
import PageTile from "$client/mobile/components/PageTitle";

export default function Devices() {
  return (
    <PageLayout header={<PageTile>Casa</PageTile>}>
      <Stack spacing={5}>
        <HomeDevices />
      </Stack>
    </PageLayout>
  );
}
