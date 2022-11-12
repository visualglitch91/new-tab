import { useHass } from "./utils/hass";
import { compact, isMobile } from "./utils/general";
import MasonryLayout from "./components/MasonryLayout";
import MobileLayout from "./components/MobileLayout";
import tvModule from "./modules/tv";
import houseModule from "./modules/house";
import vacuumModule from "./modules/vacuum";
import camerasModule from "./modules/cameras";

export default function App() {
  const { user } = useHass();
  const isAdmin = user.is_admin;

  if (isMobile) {
    return (
      <MobileLayout
        tabs={compact([
          {
            title: "TV",
            icon: "mdi:television-classic",
            content: tvModule,
            /*
             * The content has just some scrolling on mobile devices
             * and is a bit buggy because of this, this does not happen
             * when the scroll height is larger, so we implement our
             * own scrolling in this case to avoid this
             */
            managedScroll: false,
          },
          {
            title: "Casa",
            icon: "mdi:home",
            content: houseModule,
            managedScroll: false,
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
        ])}
      />
    );
  }

  return (
    <MasonryLayout>
      {tvModule}
      {houseModule}
      {isAdmin && vacuumModule}
      {isAdmin && camerasModule}
    </MasonryLayout>
  );
}
