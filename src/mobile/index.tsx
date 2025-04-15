import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import RouteRedirect from "$app/components/RouteRedirect";
import { AppDrawer } from "./components/AppDrawer";
import HomePage from "./pages/Home";
import SchedulesPage from "./pages/Schedules";
import TimersPage from "./pages/Timers";
import ManagementPage from "./pages/Management";
import AppManagerPage from "./pages/AppManager";

const pages = [
  {
    path: "/mobile/home",
    matchAll: true,
    icon: "home-outline",
    label: "Casa",
    component: <HomePage />,
  },
  {
    label: "Timers",
    icon: "clock-outline",
    path: "/mobile/timers/timers",
    admin: true,
    component: <TimersPage />,
  },
  {
    label: "Agendamentos",
    icon: "calendar-outline",
    path: "/mobile/timers/schedule",
    admin: true,
    component: <SchedulesPage />,
  },
  {
    label: "Administração",
    icon: "cog-outline",
    path: "/mobile/admin/management",
    component: <ManagementPage />,
  },
  {
    label: "Aplicações",
    icon: "apps",
    path: "/mobile/admin/apps",
    admin: true,
    component: <AppManagerPage />,
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
