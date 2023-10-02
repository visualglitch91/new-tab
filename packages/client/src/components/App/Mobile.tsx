import { compact } from "../../utils/general";
import MobileLayout from "../MobileLayout";
import Stack from "../Stack";

import TV from "../../widgets/TV";
import Home from "../../widgets/Home";
import Vacuum from "../../widgets/Vacuum";
import Cameras from "../../widgets/Cameras";
import Klipper from "../../widgets/Klipper";
import Batteries from "../../widgets/Batteries";
import Server from "../../widgets/Server";
import Torrents from "../../widgets/Torrents";
import PackageTracker from "../../widgets/PackageTracker";
import JDownloader from "../../widgets/JDownloader";
import FileManager from "../../widgets/FileManager";
import HomeControlSystemCard from "../HomeControlSystemCard";
import HACSUpdates from "../HACSUpdates";
import AppManager from "../../widgets/AppManager";
import Timers from "../Timers";
import Schedules from "../Schedules";
import MultipleResponsiveCard from "../ResponsiveCard/MulitpleResponsiveCard";
import RecentlyRequested from "../MediaCenter/RecentlyRequested";
import Trending from "../MediaCenter/Trending";
import StickMobileHeader from "../StickMobileHeader";
import TitleCard from "../TitleCard";

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
          icon: "mdi:television",
          content: <TV />,
        },
        {
          key: "house",
          title: "Casa",
          icon: "mdi:home",
          content: (
            <Stack largeGap>
              <Home />
            </Stack>
          ),
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
                icon: "mdi:clock-outline",
                content: (
                  <MultipleResponsiveCard
                    stickyMobileTitle
                    largerMobileTitle
                    views={{
                      timers: ["Timers", <Timers />],
                      schedules: ["Agendamentos", <Schedules />],
                    }}
                  />
                ),
              },
              {
                key: "media-center",
                title: "Media Center",
                icon: "mdi:movie-open-outline",
                content: (
                  <MultipleResponsiveCard
                    stickyMobileTitle
                    largerMobileTitle
                    views={{
                      recentlyRequested: ["Recentes", <RecentlyRequested />],
                      rrending: ["Populares", <Trending />],
                    }}
                  />
                ),
              },
              camerasOn && {
                key: "cameras",
                title: "Câmeras",
                icon: "mdi:webcam",
                content: <Cameras />,
              },
              printerOn && {
                key: "klipper",
                title: "Impressora 3D",
                icon: "mdi:printer-3d-nozzle",
                content: <Klipper />,
              },
              {
                key: "downloads",
                title: "Downloads",
                icon: "mdi:download-outline",
                content: (
                  <MultipleResponsiveCard
                    stickyMobileTitle
                    largerMobileTitle
                    views={{
                      torrets: ["Torrents", <Torrents />],
                      jDownloader: ["JDownloader", <JDownloader />],
                      fileManager: ["Downloads", <FileManager />],
                    }}
                  />
                ),
              },
              {
                key: "system",
                title: "Sistema",
                icon: "mdi:cpu-64-bit",
                content: (
                  <Stack largeGap>
                    <StickMobileHeader>
                      <TitleCard size="lg" title="Sistema" />
                    </StickMobileHeader>
                    <HomeControlSystemCard />
                    <Server />
                    <Batteries />
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
