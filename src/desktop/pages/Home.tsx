import { Stack } from "@mui/material";
import HomeDevices from "$app/components/HomeDevices";
import Cameras, { useAvailableCameras } from "$app/components/Cameras";
import Vacuum from "$app/components/Vacuum";
import TV from "$app/components/TV";
import { useIsAdmin } from "$app/utils/hass";
import MasonryLayout from "$app/desktop/components/DesktopLayout/MasonryLayout";

export default function HomePage() {
  const isAdmin = useIsAdmin();
  const availableEntityIds = useAvailableCameras();
  const camerasOn = availableEntityIds.length > 0;

  return (
    <MasonryLayout
      items={[
        <Stack spacing={4.5}>
          <TV />
          <HomeDevices slice={[1, 3]} />
        </Stack>,
        <Stack spacing={4.5}>
          <HomeDevices slice={[3]} />
        </Stack>,
        isAdmin && (
          <Stack spacing={4.5}>
            {camerasOn && <Cameras />}
            <Vacuum />
          </Stack>
        ),
      ]}
    />
  );
}
