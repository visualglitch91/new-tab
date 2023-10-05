import PageLayout from "../components/PageLayout";
import PageTile from "../components/PageTitle";
import Klipper, { useKlipperActionButton } from "../../components/Klipper";

export default function PrinterPage() {
  const klipperActionButton = useKlipperActionButton();

  return (
    <PageLayout
      header={<PageTile>Impressora 3D</PageTile>}
      headerItems={klipperActionButton}
    >
      <Klipper />
    </PageLayout>
  );
}
