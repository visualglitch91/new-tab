import { Stack } from "@mui/material";
import PageLayout from "$client/mobile/components/PageLayout";
import PageTile from "$client/mobile/components/PageTitle";
import Server from "$client/components/Server";
import Batteries from "$client/components/Batteries";
import HACSUpdates from "$client/components/HACSUpdates";
import HomeControlCard from "$client/components/HomeControlCard";

export default function ManagementPage() {
  return (
    <PageLayout header={<PageTile>Administração</PageTile>}>
      <Stack spacing={5}>
        <HomeControlCard />
        <Server />
        <HACSUpdates />
        <Batteries />
      </Stack>
    </PageLayout>
  );
}
