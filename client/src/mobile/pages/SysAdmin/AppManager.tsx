import PageLayout from "$client/mobile/components/PageLayout";
import PageTile from "$client/mobile/components/PageTitle";
import AppManager from "$client/components/AppManager";
import { Stack } from "@mui/material";

export default function AppManagerPage() {
  return (
    <PageLayout header={<PageTile>Aplicações</PageTile>}>
      <Stack spacing={5}>
        <AppManager />
      </Stack>
    </PageLayout>
  );
}
