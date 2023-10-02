import { compact } from "../../utils/general";
import DesktopLayout from "../DesktopLayout";
import Stack from "../Stack";
import Timers from "../Timers";
import Schedules from "../Schedules";

import TV from "../../widgets/TV";
import Home from "../../widgets/Home";
import Vacuum from "../../widgets/Vacuum";
import Cameras from "../../widgets/Cameras";
import Klipper from "../../widgets/Klipper";
import System from "../../widgets/Server";
import Batteries from "../../widgets/Batteries";
import Torrents from "../../widgets/Torrents";
import DesktopDashboard from "../../widgets/DesktopDashboard";
import JDownloader from "../../widgets/JDownloader";
import FileManager from "../../widgets/FileManager";
import HACSUpdates from "../HACSUpdates";
import HomeControlSystemCard from "../HomeControlSystemCard";
import AppManager from "../../widgets/AppManager";
import RecentlyRequested from "../MediaCenter/RecentlyRequested";
import Trending from "../MediaCenter/Trending";

export default function DesktopApp({
  isAdmin,
  camerasOn,
  printerOn,
}: {
  isAdmin: boolean;
  camerasOn: boolean;
  printerOn: boolean;
}) {
  return (
    <DesktopLayout
      tabs={compact([
        isAdmin && {
          key: "desktop-dashboard",
          title: "Dashboard",
          icon: "mdi:view-dashboard-variant-outline",
          masonry: false,
          content: [<DesktopDashboard />],
        },
        {
          key: "media",
          title: "Media",
          icon: "mdi:movie-open-outline",
          content: [<TV />, <RecentlyRequested />, <Trending />],
        },
        {
          key: "house",
          title: "Casa",
          icon: "mdi:home",
          content: [
            <Stack sx={{ gap: "34px" }}>
              <Home slice={[0, 3]} />
            </Stack>,
            <Stack sx={{ gap: "34px" }}>
              <Home slice={[3]} />
            </Stack>,
            isAdmin && camerasOn && <Cameras />,
            isAdmin && <Vacuum />,
          ],
        },
        {
          key: "timers",
          title: "Timers",
          icon: "mdi:clock",
          content: [<Timers />, <Schedules />],
        },
        ...(isAdmin
          ? [
              printerOn && {
                key: "klipper",
                title: "Impressora 3D",
                icon: "mdi:printer-3d-nozzle",
                content: [<Klipper />],
              },
              {
                key: "file-manager",
                title: "Downloads",
                icon: "mdi:download",
                content: [<FileManager />, <Torrents />, <JDownloader />],
              },
              {
                key: "system",
                title: "Sistema",
                icon: "mdi:cpu-64-bit",
                content: [
                  <System />,
                  <Batteries />,
                  <HACSUpdates />,
                  <HomeControlSystemCard />,
                  <AppManager />,
                ],
              },
            ]
          : []),
      ])}
    />
  );
}
