import { useUser } from "./utils/hass";
import { compact, isMobile } from "./utils/general";
import MasonryLayout from "./components/MasonryLayout";
import MobileLayout from "./components/MobileLayout";
import tvModule from "./modules/tv";
import houseModule from "./modules/house";
import vacuumModule from "./modules/vacuum";
import camerasModule from "./modules/cameras";

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  rowGap: 16,
} as const;

export default function App() {
  const user = useUser();
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
      <div style={columnStyle}>{houseModule.slice(0, -3)}</div>
      {isAdmin && vacuumModule}
      {houseModule.slice(-3)}
      {isAdmin && camerasModule}
    </MasonryLayout>
  );
}
