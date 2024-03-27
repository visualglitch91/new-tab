import { Box, Stack } from "@mui/material";
import ServerModule from "$client/components/Server";
import Batteries from "$client/components/Batteries";
import HACSUpdates from "$client/components/HACSUpdates";
import HomeControlCard from "$client/components/HomeControlCard";
import MasonryLayout from "$client/desktop/components/DesktopLayout/MasonryLayout";
import AppManager from "$client/components/AppManager";

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
