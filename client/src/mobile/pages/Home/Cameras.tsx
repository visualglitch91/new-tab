import Cameras from "$client/components/Cameras";
import PageLayout from "$client/mobile/components/PageLayout";
import PageTile from "$client/mobile/components/PageTitle";

export default function CamerasPage() {
  return (
    <PageLayout header={<PageTile>Câmeras</PageTile>}>
      <Cameras />
    </PageLayout>
  );
}
