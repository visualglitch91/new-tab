import { Stack } from "@mui/material";
import HomeDevices from "../../components/HomeDevices";
import Cameras, { useAvailableCameras } from "../../components/Cameras";
import Vacuum from "../../components/Vacuum";
import { useIsAdmin } from "../../utils/hass";
import Section from "../../components/Section";
import MasonryLayout from "../components/DesktopLayout/MasonryLayout";

export default function HomePage() {
  const isAdmin = useIsAdmin();
  const availableEntityIds = useAvailableCameras();
  const camerasOn = availableEntityIds.length > 0;

  return (
    <MasonryLayout
      items={[
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
