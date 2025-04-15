import { Stack } from "@mui/material";
import HomeDevices from "$app/components/HomeDevices";

export default function HomePage() {
  return (
    <Stack gap={3}>
      <HomeDevices dividers />
    </Stack>
  );
}
