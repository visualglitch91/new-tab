import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import Torrents, { useAddTorrent } from "../../../components/Torrents";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function TorrentsPage() {
  const addTorrent = useAddTorrent();

  return (
    <PageLayout
      header={<PageTile>Torrents</PageTile>}
      headerItems={
        <AltIconButton onClick={addTorrent}>
          <Icon icon="plus" size={20} />
        </AltIconButton>
      }
    >
      <Torrents />
    </PageLayout>
  );
}
