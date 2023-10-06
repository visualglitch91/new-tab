import DesktopLayout from "./components/DesktopLayout";
import DashboardPage from "./pages/Dashboard";
import MediaPage from "./pages/Media";
import HomePage from "./pages/Home";
import TimersAndSchedulesPage from "./pages/TimersAndSchedules";
import PrinterPage from "./pages/Printer";
import DownloadsPage from "./pages/Downloads";
import SysAdminPage from "./pages/SysAdmin";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import RouteRedirect from "../components/RouteRedirect";
import { useIsAdmin } from "../utils/hass";

const pages = [
  {
    path: "/dashboard",
    icon: "view-dashboard-variant-outline",
    label: "Dashboard",
    admin: true,
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
    icon: "home-outline",
    component: <HomePage />,
  },
  {
    path: "/timers",
    label: "Timers",
    icon: "clock-outline",
    component: <TimersAndSchedulesPage />,
  },
  {
    path: "/printer",
    label: "Impressora 3D",
    icon: "printer-3d-nozzle-outline",
    admin: true,
    component: <PrinterPage />,
  },
  {
    path: "/downloads",
    icon: "cloud-download-outline",
    label: "Downloads",
    admin: true,
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
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [location]);

  return (
    <DesktopLayout contentRef={contentRef} pages={pages}>
      <RouteRedirect from="/" to="/dashboard" />
      <Switch>
        {pages.map((page) => {
          if (page.admin && !isAdmin) {
            return null;
          }

          return (
            <Route key={page.path} path={page.path}>
              {page.component}
            </Route>
          );
        })}
      </Switch>
    </DesktopLayout>
  );
}
