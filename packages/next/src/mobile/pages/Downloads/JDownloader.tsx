import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import JDownloader from "../../../components/JDownloader";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function JDownloaderPage() {
  return (
    <PageLayout
      header={<PageTile>JDownloader</PageTile>}
      headerItems={
        <AltIconButton onClick={() => console.log("add link")}>
          <Icon icon="plus" size={20} />
        </AltIconButton>
      }
    >
      <JDownloader />
    </PageLayout>
  );
}
