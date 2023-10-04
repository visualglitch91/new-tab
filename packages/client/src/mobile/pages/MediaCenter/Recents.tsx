import RecentlyRequested from "../../../components/MediaCenter/RecentlyRequested";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function Recents() {
  return (
    <PageLayout header={<PageTile>Na Fila</PageTile>}>
      <RecentlyRequested />
    </PageLayout>
  );
}
