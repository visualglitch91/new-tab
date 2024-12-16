import Vacuum from "$app/components/Vacuum";
import PageLayout from "$app/mobile/components/PageLayout";
import PageTile from "$app/mobile/components/PageTitle";

export default function VacuumPage() {
  return (
    <PageLayout header={<PageTile>Aspirador</PageTile>}>
      <Vacuum label="Status" />
    </PageLayout>
  );
}
