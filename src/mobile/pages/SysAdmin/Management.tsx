import { Stack } from "@mui/material";
import PageLayout from "$app/mobile/components/PageLayout";
import PageTile from "$app/mobile/components/PageTitle";
import Server from "$app/components/Server";
import Batteries from "$app/components/Batteries";
import HACSUpdates from "$app/components/HACSUpdates";
import HomeControlCard from "$app/components/HomeControlCard";

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
