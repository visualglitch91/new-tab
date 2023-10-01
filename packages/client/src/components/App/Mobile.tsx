import { compact } from "../../utils/general";
import MobileLayout from "../MobileLayout";
import Stack from "../Stack";

import TV from "../../widgets/TV";
import Home from "../../widgets/Home";
import Vacuum from "../../widgets/Vacuum";
import Cameras from "../../widgets/Cameras";
import Klipper from "../../widgets/Klipper";
import System from "../../widgets/Batteries";
import Torrents from "../../widgets/Torrents";
import Ombi from "../../widgets/Ombi";
import PackageTracker from "../../widgets/PackageTracker";
import JDownloader from "../../widgets/JDownloader";
import FileManager from "../../widgets/FileManager";
import HomeControlSystemCard from "../HomeControlSystemCard";
import HACSUpdates from "../HACSUpdates";
import AppManager from "../../widgets/AppManager";
import Timers from "../Timers";
import Schedules from "../Schedules";

export default function MobileApp({
  isAdmin,
  camerasOn,
  printerOn,
}: {
  isAdmin: boolean;
  camerasOn: boolean;
  printerOn: boolean;
}) {
  return (
    <MobileLayout
      mainTabs={compact([
        {
          key: "tv",
          title: "TV",
          icon: "mdi:television-classic",
          content: <TV />,
        },
        {
          key: "house",
          title: "Casa",
          icon: "mdi:home",
          content: <Home />,
        },
        isAdmin && {
          key: "vacuum",
          title: "Aspirador",
          icon: "mdi:robot-vacuum",
          content: <Vacuum />,
        },
      ])}
      extraTabs={
        isAdmin
          ? compact([
              {
                key: "packages",
                title: "Encomendas",
                icon: "mdi:truck-delivery-outline",
                content: <PackageTracker />,
              },
              {
                key: "timers",
                title: "Timers",
                icon: "mdi:clock",
                content: (
                  <Stack>
                    <Timers />
                    <Schedules />
                  </Stack>
                ),
              },
              {
                key: "ombi",
                title: "Ombi",
                icon: "mdi:movie-open-outline",
                content: <Ombi />,
              },
              camerasOn && {
                key: "cameras",
                title: "Câmeras",
                icon: "mdi:cctv",
                content: <Cameras />,
              },
              printerOn && {
                key: "klipper",
                title: "Impressora 3D",
                icon: "mdi:printer-3d-nozzle",
                content: <Klipper />,
              },
              {
                key: "torrents",
                title: "Torrents",
                icon: "mdi:download",
                content: <Torrents />,
              },
              {
                key: "jdownloader",
                title: "JDownloader",
                icon: "mdi:download",
                content: <JDownloader />,
              },
              {
                key: "downloads",
                title: "Downloads",
                icon: "mdi:folder-multiple",
                content: <FileManager />,
              },
              {
                key: "system",
                title: "Sistema",
                icon: "mdi:cpu-64-bit",
                content: (
                  <Stack>
                    <HomeControlSystemCard />
                    <System />
                    <HACSUpdates />
                    <AppManager />
                  </Stack>
                ),
              },
            ])
          : []
      }
    />
  );
}
