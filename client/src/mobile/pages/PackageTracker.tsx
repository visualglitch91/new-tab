import { Stack } from "@mui/material";
import PackageTracker, {
  PackageTrackerMenu,
} from "$client/components/PackageTracker";
import PageLayout from "../components/PageLayout";
import PageTile from "../components/PageTitle";

export default function PackageTrackerPage() {
  return (
    <PageLayout
      header={<PageTile>Correrios</PageTile>}
      headerItems={<PackageTrackerMenu />}
    >
      <Stack spacing={2}>
        <PackageTracker />
      </Stack>
    </PageLayout>
  );
}
