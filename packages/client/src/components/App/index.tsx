import { useEffect } from "react";
import { useEntity, useUser } from "../../utils/hass";
import { useResponsive } from "../../utils/general";
import { useAvailableCameras } from "../../widgets/Cameras";
import MobileApp from "./Mobile";
import DesktopApp from "./Desktop";

export default function App() {
  const isAdmin = useUser().is_admin;
  const { isMobile } = useResponsive();
  const availableEntityIds = useAvailableCameras();

  const camerasOn = availableEntityIds.length > 0;
  const printerOn = useEntity("switch.impressora_3d_servidor")?.state === "on";

  const props = {
    isAdmin,
    camerasOn,
    printerOn,
  };

  useEffect(() => {
    setTimeout(() => document.body.classList.add("ready"), 120);
  }, []);

  if (isMobile) {
    return <MobileApp {...props} />;
  }

  return <DesktopApp {...props} />;
}
