import Cameras from "$app/components/Cameras";
import PageLayout from "$app/mobile/components/PageLayout";
import PageTile from "$app/mobile/components/PageTitle";

export default function CamerasPage() {
  return (
    <PageLayout header={<PageTile>Câmeras</PageTile>}>
      <Cameras />
    </PageLayout>
  );
}
