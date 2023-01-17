import { useEffect } from "react";
import { useEntity, useUser } from "./utils/hass";
import { compact, useResponsive } from "./utils/general";
import MasonryLayout from "./components/MasonryLayout";
import MobileLayout from "./components/MobileLayout";
import tvModule from "./modules/tv";
import houseModule from "./modules/house";
import vacuumModule from "./modules/vacuum";
import camerasModule, { useAvailableCameras } from "./modules/cameras";
import octoprintModule from "./modules/octoprint";
import systemModule from "./modules/system";
import packagesModule from "./modules/packages";

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  rowGap: 16,
} as const;

export default function App() {
  const isAdmin = useUser().is_admin;
  const { isMobile } = useResponsive();
  const availableEntityIds = useAvailableCameras();

  const camerasOn = availableEntityIds.length > 0;
  const printerOn = useEntity("switch.impressora_3d")?.state === "on";

  useEffect(() => {
    setTimeout(() => document.body.classList.add("ready"), 120);
  }, []);

  if (isMobile) {
    return (
      <MobileLayout
        mainTabs={compact([
          {
            key: "tv",
            title: "TV",
            icon: "mdi:television-classic",
            content: tvModule,
          },
          {
            key: "house",
            title: "Casa",
            icon: "mdi:home",
            content: houseModule,
          },
          isAdmin && {
            key: "vacuum",
            title: "Aspirador",
            icon: "mdi:robot-vacuum",
            content: vacuumModule,
          },
        ])}
        extraTabs={
          isAdmin
            ? compact([
                {
                  key: "packages",
                  title: "Encomendas",
                  icon: "mdi:truck-delivery-outline",
                  content: packagesModule,
                },
                camerasOn && {
                  key: "cameras",
                  title: "Câmeras",
                  icon: "mdi:cctv",
                  content: camerasModule,
                },
                printerOn && {
                  key: "octoprint",
                  title: "OctoPrint",
                  icon: "mdi:printer-3d-nozzle",
                  content: octoprintModule,
                },
                {
                  key: "system",
                  title: "Sistema",
                  icon: "mdi:cpu-64-bit",
                  content: systemModule,
                },
              ])
            : []
        }
      />
    );
  }

  return (
    <MasonryLayout>
      {tvModule}
      <div style={columnStyle}>{houseModule}</div>
      {isAdmin && systemModule}
      {isAdmin && vacuumModule}
      {isAdmin && camerasOn && camerasModule}
      {isAdmin && printerOn && octoprintModule}
      {isAdmin && packagesModule}
    </MasonryLayout>
  );
}
