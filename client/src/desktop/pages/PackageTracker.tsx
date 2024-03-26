import { Box } from "@mui/material";
import PackageTracker, {
  PackageTrackerMenu,
} from "$client/components/PackageTracker";
import Section from "$client/components/Section";

export default function PackageTrackerPage() {
  return (
    <Section title="Correrios" button={<PackageTrackerMenu />}>
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
