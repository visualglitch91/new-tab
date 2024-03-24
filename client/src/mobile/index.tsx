import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import RouteRedirect from "$client/components/RouteRedirect";
import { AppDrawer } from "./components/AppDrawer";
import TimersAndSchedule from "./pages/Timers";
import Home from "./pages/Home";
import SysAdmin from "./pages/SysAdmin";

const pages = [
  {
    path: "/mobile/home",
    matchAll: true,
    icon: "home-outline",
    label: "Casa",
    component: <Home />,
  },
  {
    path: "/mobile/timers",
    matchAll: true,
    icon: "clock-outline",
    label: "Timers e Agendamentos",
    component: <TimersAndSchedule />,
  },
  {
    path: "/mobile/admin",
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
