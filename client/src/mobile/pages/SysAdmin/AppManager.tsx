import PageLayout from "$client/mobile/components/PageLayout";
import PageTile from "$client/mobile/components/PageTitle";
import AppManager from "$client/components/AppManager";

export default function AppManagerPage() {
  return (
    <PageLayout header={<PageTile>Aplicações</PageTile>}>
      <AppManager />
    </PageLayout>
  );
}
