import { Stack } from "@mui/material";
import HomeDevices from "$app/components/HomeDevices";
import MasonryLayout from "$app/desktop/components/DesktopLayout/MasonryLayout";

export default function HomePage() {
  return (
    <MasonryLayout
      items={[
        <Stack spacing={4.5}>
          <HomeDevices slice={[0, 2]} />
        </Stack>,
        <Stack spacing={4.5}>
          <HomeDevices slice={[2, 5]} />
        </Stack>,
        <Stack spacing={4.5}>
          <HomeDevices slice={[5]} />
        </Stack>,
      ]}
    />
  );
}
