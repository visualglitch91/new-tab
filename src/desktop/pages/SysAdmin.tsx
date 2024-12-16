import { Box, Stack } from "@mui/material";
import ServerModule from "$app/components/Server";
import Batteries from "$app/components/Batteries";
import HACSUpdates from "$app/components/HACSUpdates";
import HomeControlCard from "$app/components/HomeControlCard";
import MasonryLayout from "$app/desktop/components/DesktopLayout/MasonryLayout";
import AppManager from "$app/components/AppManager";

export default function SysAdminPage() {
  return (
    <Stack direction="row" flexWrap="wrap" gap={4}>
      <Box
        sx={{
          minWidth: 450,
          width: { xs: "100%", lg: "30%" },
        }}
      >
        <MasonryLayout
          items={[
            <HomeControlCard />,
            <ServerModule />,
            <HACSUpdates />,
            <Batteries />,
          ]}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          flex: 1,
        }}
      >
        <MasonryLayout items={[<AppManager />]} />
      </Box>
    </Stack>
  );
}
