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
          { title: "TV", content: tvModule },
          { title: "Casa", content: houseModule },
          ...(isAdmin
            ? [
                { title: "Aspirador", content: vacuumModule },
                {
                  title: "Câmeras",
                  content: camerasModule,
                },
              ]
            : []),
        ]}
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
