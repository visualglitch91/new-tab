import Bookmarks from "$client/components/Bookmarks";
import PageLayout from "../components/PageLayout";
import PageTile from "../components/PageTitle";

export default function AppsPage() {
  return (
    <PageLayout header={<PageTile>Apps</PageTile>} sx={{ pb: 8 }}>
      <Bookmarks />
    </PageLayout>
  );
}
