import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import RouteRedirect from "$client/components/RouteRedirect";
import { useIsAdmin } from "$client/utils/hass";
import DesktopLayout from "./components/DesktopLayout";
import HomePage from "./pages/Home";
import TimersAndSchedulesPage from "./pages/TimersAndSchedules";
import ManagementPage from "./pages/Management";
import AppManagerPage from "./pages/AppManager";

const pages = [
  {
    path: "/desktop/home",
    label: "Casa",
    icon: "home-outline",
    component: <HomePage />,
  },
  {
    path: "/desktop/timers",
    label: "Timers e Agendamentos",
    icon: "clock-outline",
    component: <TimersAndSchedulesPage />,
  },
  {
    path: "/desktop/admin",
    icon: "cog-outline",
    admin: true,
    label: "Administração",
    component: <ManagementPage />,
  },
  {
    path: "/desktop/apps",
    icon: "apps",
    admin: true,
    label: "Aplicações",
    component: <AppManagerPage />,
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
      <RouteRedirect from="/desktop/" to="/desktop/home" />
      <Switch>
        {pages.map((page) =>
          page.admin && !isAdmin ? null : (
            <Route key={page.path} path={page.path}>
              {page.component}
            </Route>
          )
        )}
      </Switch>
    </DesktopLayout>
  );
}
