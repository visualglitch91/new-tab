import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import JDownloader, { useAddDownload } from "../../../components/JDownloader";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function JDownloaderPage() {
  const addDownload = useAddDownload();

  return (
    <PageLayout
      header={<PageTile>JDownloader</PageTile>}
      headerItems={
        <AltIconButton onClick={addDownload}>
          <Icon icon="plus" size={20} />
        </AltIconButton>
      }
    >
      <JDownloader />
    </PageLayout>
  );
}
