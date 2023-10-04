import { Stack } from "@mui/material";
import HomeDevices from "../../../components/HomeDevices";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function Devices() {
  return (
    <PageLayout header={<PageTile>Casa</PageTile>}>
      <Stack spacing={5}>
        <HomeDevices />
      </Stack>
    </PageLayout>
  );
}
