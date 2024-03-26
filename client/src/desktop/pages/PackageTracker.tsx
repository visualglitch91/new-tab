import { Box } from "@mui/material";
import PackageTracker, {
  usePackageTrackerMenu,
} from "$client/components/PackageTracker";
import Section from "$client/components/Section";
import AltIconButton from "$client/components/AltIconButton";

export default function PackageTrackerPage() {
  const showMenu = usePackageTrackerMenu();

  return (
    <Section
      title="Correrios"
      button={<AltIconButton icon="dots-vertical" onClick={showMenu} />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gridGap: 16,
        }}
      >
        <PackageTracker />
      </Box>
    </Section>
  );
}
