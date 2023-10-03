import Trending from "../../../components/MediaCenter/Trending";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function TrendingPage() {
  return (
    <PageLayout header={<PageTile>Populares</PageTile>}>
      <Trending />
    </PageLayout>
  );
}
