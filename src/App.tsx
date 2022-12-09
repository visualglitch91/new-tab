import { useEntity, useUser } from "./utils/hass";
import { compact, useResponsive } from "./utils/general";
import MasonryLayout from "./components/MasonryLayout";
import MobileLayout from "./components/MobileLayout";
import tvModule from "./modules/tv";
import houseModule from "./modules/house";
import vacuumModule from "./modules/vacuum";
import camerasModule from "./modules/cameras";
import octoprintModule from "./modules/octoprint";

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  rowGap: 16,
} as const;

export default function App() {
  const user = useUser();
  const { isMobile } = useResponsive();

  const camerasOn = useEntity("switch.cameras")?.state === "on";
  const octoprintState = useEntity("sensor.octoprint_current_state")?.state;
  const printerState = useEntity("switch.impressora_3d")?.state;
  const octoprintOn = printerState === "on" && octoprintState !== "unavailable";

  const isAdmin = user.is_admin;

  if (isMobile) {
    return (
      <MobileLayout
        tabs={compact([
          {
            title: "TV",
            icon: "mdi:television-classic",
            content: tvModule,
          },
          {
            title: "Casa",
            icon: "mdi:home",
            content: houseModule,
          },
          isAdmin && {
            title: "Aspirador",
            icon: "mdi:robot-vacuum",
            content: vacuumModule,
          },
          isAdmin &&
            camerasOn && {
              title: "Câmeras",
              icon: "mdi:cctv",
              content: camerasModule,
            },
          isAdmin &&
            octoprintOn && {
              title: "OctoPrint",
              icon: "mdi:printer-3d-nozzle",
              content: octoprintModule,
            },
        ])}
      />
    );
  }

  return (
    <MasonryLayout>
      {tvModule}
      <div style={columnStyle}>{houseModule.slice(0, -2)}</div>
      {isAdmin && vacuumModule}
      <div style={columnStyle}>{houseModule.slice(-2)}</div>
      {isAdmin && camerasOn && camerasModule}
      {isAdmin && octoprintOn && octoprintModule}
    </MasonryLayout>
  );
}
