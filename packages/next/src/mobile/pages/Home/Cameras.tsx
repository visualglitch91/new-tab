import Cameras from "../../../components/Cameras";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function CamerasPage() {
  return (
    <PageLayout header={<PageTile>Câmeras</PageTile>}>
      <Cameras />
    </PageLayout>
  );
}
