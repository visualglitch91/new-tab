import { Box } from "@mui/material";
import PackageTracker, {
  usePackageTrackerMenu,
} from "$client/components/PackageTracker";
import Section from "$client/components/Section";
import MasonryLayout from "$client/desktop/components/DesktopLayout/MasonryLayout";
import AltIconButton from "$client/components/AltIconButton";

export default function PackageTrackerPage() {
  const showMenu = usePackageTrackerMenu();

  return (
    <Section
      title="Correrios"
      button={<AltIconButton icon="dots-vertical" onClick={showMenu} />}
    >
      <Box maxWidth={1200}>
        <MasonryLayout items={[<PackageTracker />]} />
      </Box>
    </Section>
  );
}
