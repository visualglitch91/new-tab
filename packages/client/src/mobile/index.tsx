import { Route, Switch, useLocation } from "wouter";
import { AppDrawer } from "./components/AppDrawer";
import TimersAndSchedule from "./pages/Timers";
import RouteRedirect from "../components/RouteRedirect";
import Downloads from "./pages/Downloads";
import MediaCenter from "./pages/MediaCenter";
import TV from "./pages/TV";
import Home from "./pages/Home";
import SysAdmin from "./pages/SysAdmin";
import { useEffect } from "react";
import PackageTracker from "./pages/PackageTracker";

const pages = [
  {
    path: "/tv",
    icon: "television",
    label: "TV",
    component: <TV />,
  },
  {
    path: "/home",
    matchAll: true,
    icon: "home-outline",
    label: "Home",
    component: <Home />,
  },
  {
    path: "/package-tracker",
    icon: "truck-delivery-outline",
    label: "Encomendas",
    component: <PackageTracker />,
  },
  {
    path: "/media-center",
    matchAll: true,
    icon: "movie-open-outline",
    label: "Media Center",
    component: <MediaCenter />,
  },
  {
    path: "/timers",
    matchAll: true,
    icon: "clock-outline",
    label: "Timers e Agendamentos",
    component: <TimersAndSchedule />,
  },
  {
    path: "/downloads",
    matchAll: true,
    icon: "cloud-download-outline",
    label: "Downloads",
    component: <Downloads />,
  },
  {
    path: "/sys-admin",
    matchAll: true,
    icon: "cog-outline",
    label: "Sistema",
    component: <SysAdmin />,
  },
];

export default function Mobile() {
  const [location] = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [location]);

  return (
    <>
      <RouteRedirect from="/" to="/home" />
      <AppDrawer pages={pages} />
      <Switch>
        {pages.map((page) => (
          <Route
            key={page.path}
            path={page.matchAll ? `${page.path}/:rest*` : page.path}
          >
            {page.component}
          </Route>
        ))}
      </Switch>
    </>
  );
}
