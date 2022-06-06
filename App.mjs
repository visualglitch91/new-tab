import { h } from "./utils/preact.mjs";
import { useHass } from "./utils/hass.mjs";
import DesktopLayout from "./components/DesktopLayout.mjs";
import MobileLayout from "./components/MobileLayout.mjs";
import tvModule from "./modules/tv.mjs";
import houseModule from "./modules/house.mjs";
import vacuumModule from "./modules/vacuum.mjs";
import camerasModule from "./modules/cameras.mjs";

export default function App() {
  const { isAdmin } = useHass();
  const isMobile = window.innerWidth < 935;

  if (isMobile) {
    return h`
      <${MobileLayout}
        tabs=${[
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
          isAdmin && {
            title: "Câmeras",
            icon: "mdi:cctv",
            content: camerasModule,
          },
        ].filter(Boolean)}
      />`;
  }

  return h`
    <${DesktopLayout}>
      ${tvModule}
      ${houseModule}
      ${isAdmin && vacuumModule}
      ${isAdmin && camerasModule}
    </${DesktopLayout}>
  `;
}
