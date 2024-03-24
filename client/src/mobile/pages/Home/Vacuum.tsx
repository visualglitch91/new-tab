import Vacuum from "$client/components/Vacuum";
import PageLayout from "$client/mobile/components/PageLayout";
import PageTile from "$client/mobile/components/PageTitle";

export default function VacuumPage() {
  return (
    <PageLayout header={<PageTile>Aspirador</PageTile>}>
      <Vacuum />
    </PageLayout>
  );
}
