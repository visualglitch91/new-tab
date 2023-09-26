import { useEffect } from "react";
import { useEntity, useUser } from "./utils/hass";
import { compact, useResponsive } from "./utils/general";
import MasonryLayout from "./components/MasonryLayout";
import MobileLayout from "./components/MobileLayout";
import tvModule from "./modules/tv";
import houseModule from "./modules/house";
import vacuumModule from "./modules/vacuum";
import camerasModule, { useAvailableCameras } from "./modules/cameras";
import klipperModule from "./modules/klipper";
import systemModule from "./modules/system";
// import packagesModule from "./modules/packages";
import torrentsModule from "./modules/torrents";
import DesktopLayout from "./components/DesktopLayout";

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
  const printerOn = useEntity("switch.impressora_3d_servidor")?.state === "on";

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
                // {
                //   key: "packages",
                //   title: "Encomendas",
                //   icon: "mdi:truck-delivery-outline",
                //   content: packagesModule,
                // },
                camerasOn && {
                  key: "cameras",
                  title: "Câmeras",
                  icon: "mdi:cctv",
                  content: camerasModule,
                },
                printerOn && {
                  key: "klipper",
                  title: "Impressora 3D",
                  icon: "mdi:printer-3d-nozzle",
                  content: klipperModule,
                },
                {
                  key: "torrents",
                  title: "Torrents",
                  icon: "mdi:download",
                  content: torrentsModule,
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
    <DesktopLayout
      tabs={compact([
        {
          key: "media",
          title: "Media",
          icon: "mdi:movie-open-outline",
          content: [tvModule, isAdmin && torrentsModule],
        },
        {
          key: "house",
          title: "Casa",
          icon: "mdi:home",
          content: [
            houseModule,
            isAdmin && camerasOn && camerasModule,
            isAdmin && vacuumModule,
          ],
        },
        ...(isAdmin
          ? [
              printerOn && {
                key: "klipper",
                title: "Impressora 3D",
                icon: "mdi:printer-3d-nozzle",
                content: [klipperModule],
              },
              {
                key: "system",
                title: "Sistema",
                icon: "mdi:cpu-64-bit",
                content: [systemModule],
              },
            ]
          : []),
      ])}
    />
  );
}
