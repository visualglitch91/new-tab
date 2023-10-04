import Vacuum from "../../../components/Vacuum";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function VacuumPage() {
  return (
    <PageLayout header={<PageTile>Aspirador</PageTile>}>
      <Vacuum />
    </PageLayout>
  );
}
