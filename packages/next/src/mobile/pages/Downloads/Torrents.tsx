import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import Torrents from "../../../components/Torrents";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function TorrentsPage() {
  return (
    <PageLayout
      header={<PageTile>Torrents</PageTile>}
      headerItems={
        <AltIconButton onClick={() => console.log("add torrent")}>
          <Icon icon="plus" size={20} />
        </AltIconButton>
      }
    >
      <Torrents />
    </PageLayout>
  );
}
