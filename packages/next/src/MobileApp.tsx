import { SwipeableDrawer } from "@mui/material";
import { useState } from "react";

export default function MobileApp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SwipeableDrawer
        disableDiscovery
        swipeAreaWidth={200}
        hysteresis={0.1}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        hello putas
      </SwipeableDrawer>
    </>
  );
}
