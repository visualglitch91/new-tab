import PageLayout from "$app/mobile/components/PageLayout";
import PageTile from "$app/mobile/components/PageTitle";
import AppManager from "$app/components/AppManager";
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
