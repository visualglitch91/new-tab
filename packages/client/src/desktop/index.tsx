import { compact } from "lodash";
import DesktopLayout from "./components/DesktopLayout";
import TV from "../components/TV";
import RecentlyRequested from "../components/MediaCenter/RecentlyRequested";
import Trending from "../components/MediaCenter/Trending";
import { Grid, Stack } from "@mui/material";
import HomeDevices from "../components/HomeDevices";
import Cameras, { useAvailableCameras } from "../components/Cameras";
import Vacuum from "../components/Vacuum";
import Timers from "../components/Timers";
import Schedules from "../components/Schedules";
import FileManager from "../components/FileManager";
import Torrents, { useAddTorrent } from "../components/Torrents";
import JDownloader, { useAddDownload } from "../components/JDownloader";
import ServerModule from "../components/Server";
import Batteries from "../components/Batteries";
import HACSUpdates from "../components/HACSUpdates";
import HomeControlCard from "../components/HomeControlCard";
import AppManager from "../components/AppManager";
import { useEntity, useUser } from "../utils/hass";
import Section from "../components/Section";
import Klipper from "../components/Klipper";
import useUpsertSchedule from "../components/Schedules/useUpsertSchedule";
import useAddTimer from "../components/Timers/useAddTimer";
import AltIconButton from "../components/AltIconButton";
import Icon from "../components/Icon";
import DashboardPage from "./pages/Dashboard";
import MediaPage from "./pages/Media";
import HomePage from "./pages/Home";
import TimersAndSchedulesPage from "./pages/TimersAndSchedules";
import PrinterPage from "./pages/Printer";
import DownloadsPage from "./pages/Downloads";
import SysAdminPage from "./pages/SysAdmin";
import { Route, Router, Switch, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import RouteRedirect from "../components/RouteRedirect";
import ClockAndWeather from "../components/ClockAndWeather";

const pages = [
  {
    path: "/dashboard",
    icon: "view-dashboard-variant-outline",
    label: "Dashboard",
    component: <DashboardPage />,
  },
  {
    path: "/media",
    label: "Media",
    icon: "movie-open-outline",
    component: <MediaPage />,
  },
  {
    path: "/home",
    label: "Casa",
    icon: "home",
    component: <HomePage />,
  },
  {
    path: "/timers",
    label: "Timers",
    icon: "clock",
    component: <TimersAndSchedulesPage />,
  },
  {
    path: "/printer",
    label: "Impressora 3D",
    icon: "printer-3d-nozzle",
    component: <PrinterPage />,
  },
  {
    path: "/downloads",
    icon: "cloud-download-outline",
    label: "Downloads",
    component: <DownloadsPage />,
  },
  {
    path: "/sys-admin",
    icon: "cog-outline",
    label: "Sistema",
    component: <SysAdminPage />,
  },
];

export default function Desktop() {
  const [location] = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [location]);

  return (
    <DesktopLayout contentRef={contentRef} pages={pages}>
      <RouteRedirect from="/" to="/dashboard" />
      <Switch>
        {pages.map((page) => (
          <Route key={page.path} path={page.path}>
            {page.component}
          </Route>
        ))}
      </Switch>
    </DesktopLayout>
  );
}
