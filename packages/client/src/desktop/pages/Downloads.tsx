import FileManager from "../../components/FileManager";
import Torrents, { useAddTorrent } from "../../components/Torrents";
import JDownloader, { useAddDownload } from "../../components/JDownloader";
import Section from "../../components/Section";
import AltIconButton from "../../components/AltIconButton";
import Icon from "../../components/Icon";
import MasonryLayout from "../components/DesktopLayout/MasonryLayout";

export default function DownloadsPage() {
  const addDownload = useAddDownload();
  const addTorrent = useAddTorrent();

  return (
    <MasonryLayout
      items={[
        <Section title="Arquivos">
          <FileManager maxHeight={500} />
        </Section>,
        <Section
          title="Torrents"
          button={
            <AltIconButton onClick={addTorrent}>
              <Icon icon="plus" size={20} />
            </AltIconButton>
          }
        >
          <Torrents maxHeight={500} />
        </Section>,
        <Section
          title="JDownloader"
          button={
            <AltIconButton onClick={addDownload}>
              <Icon icon="plus" size={20} />
            </AltIconButton>
          }
        >
          <JDownloader maxHeight={500} />
        </Section>,
      ]}
    />
  );
}
