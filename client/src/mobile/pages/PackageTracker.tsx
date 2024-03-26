import { Stack } from "@mui/material";
import PackageTracker, {
  usePackageTrackerMenu,
} from "$client/components/PackageTracker";
import PageLayout from "../components/PageLayout";
import PageTile from "../components/PageTitle";
import AltIconButton from "$client/components/AltIconButton";

export default function PackageTrackerPage() {
  const showMenu = usePackageTrackerMenu();

  return (
    <PageLayout
      header={<PageTile>Correrios</PageTile>}
      headerItems={<AltIconButton onClick={showMenu} icon="dots-vertical" />}
    >
      <Stack spacing={2}>
        <PackageTracker />
      </Stack>
    </PageLayout>
  );
}
