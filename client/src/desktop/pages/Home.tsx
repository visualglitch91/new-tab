import { Stack } from "@mui/material";
import HomeDevices from "$client/components/HomeDevices";
import Cameras, { useAvailableCameras } from "$client/components/Cameras";
import Vacuum from "$client/components/Vacuum";
import Section from "$client/components/Section";
import TV from "$client/components/TV";
import { useIsAdmin } from "$client/utils/hass";
import MasonryLayout from "$client/desktop/components/DesktopLayout/MasonryLayout";

export default function HomePage() {
  const isAdmin = useIsAdmin();
  const availableEntityIds = useAvailableCameras();
  const camerasOn = availableEntityIds.length > 0;

  return (
    <MasonryLayout
      items={[
        <TV />,
        <Stack spacing={4.5}>
          <HomeDevices slice={[1, 4]} />
        </Stack>,
        <Stack spacing={4.5}>
          <HomeDevices slice={[4]} />
        </Stack>,
        isAdmin && camerasOn && <Cameras />,
        isAdmin && (
          <Section title="Aspirador">
            <Vacuum />
          </Section>
        ),
      ]}
    />
  );
}
