import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import RouteRedirect from "$client/components/RouteRedirect";
import { AppDrawer } from "./components/AppDrawer";
import TimersAndSchedule from "./pages/Timers";
import Home from "./pages/Home";
import SysAdmin from "./pages/SysAdmin";
import PackageTracker from "./pages/PackageTracker";
import AppsPage from "./pages/Apps";

const pages = [
  {
    path: "/mobile/apps",
    icon: "apps",
    label: "Apps",
    component: <AppsPage />,
    matchAll: true,
    admin: true,
  },
  {
    path: "/mobile/home",
    matchAll: true,
    icon: "home-outline",
    label: "Casa",
    component: <Home />,
  },
  {
    path: "/mobile/package-tracker",
    label: "Correios",
    icon: "truck-delivery-outline",
    component: <PackageTracker />,
    admin: true,
  },
  {
    path: "/mobile/timers",
    icon: "clock-outline",
    label: "Timers e Agendamentos",
    component: <TimersAndSchedule />,
    matchAll: true,
    admin: true,
  },
  {
    path: "/mobile/admin",
    icon: "cog-outline",
    label: "Sistema",
    component: <SysAdmin />,
    matchAll: true,
    admin: true,
  },
];

export default function Mobile() {
  const [location] = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [location]);

  return (
    <>
      <RouteRedirect from="/mobile" to="/mobile/home" />
      <AppDrawer pages={pages} />
      <Switch>
        {pages.map((page) => (
          <Route
            key={page.path}
            path={page.matchAll ? `${page.path}/*?` : page.path}
          >
            {page.component}
          </Route>
        ))}
      </Switch>
    </>
  );
}
