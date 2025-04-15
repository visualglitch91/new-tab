import { Grid2, Stack } from "@mui/material";
import ServerModule from "$app/components/Server";
import Batteries from "$app/components/Batteries";
import HACSUpdates from "$app/components/HACSUpdates";
import HomeControlCard from "$app/components/HomeControlCard";
import AppManager from "$app/components/AppManager";

export default function SysAdminPage() {
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <Stack gap={2}>
          <AppManager />
        </Stack>
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <Stack gap={2}>
          <HomeControlCard />
          <ServerModule />
          <HACSUpdates />
          <Batteries />
        </Stack>
      </Grid2>
    </Grid2>
  );
}
