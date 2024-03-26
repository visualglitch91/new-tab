import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef } from "react";
import RouteRedirect from "$client/components/RouteRedirect";
import { useIsAdmin } from "$client/utils/hass";
import DesktopLayout from "./components/DesktopLayout";
import HomePage from "./pages/Home";
import TimersAndSchedulesPage from "./pages/TimersAndSchedules";
import ManagementPage from "./pages/Management";
import AppManagerPage from "./pages/AppManager";
import PackageTracker from "./pages/PackageTracker";

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
    admin: true,
  },
  {
    path: "/desktop/package-tracker",
    label: "Correios",
    icon: "truck-delivery-outline",
    component: <PackageTracker />,
    admin: true,
  },
  {
    path: "/desktop/admin",
    icon: "cog-outline",
    label: "Administração",
    component: <ManagementPage />,
    admin: true,
  },
  {
    path: "/desktop/apps",
    icon: "apps",
    label: "Aplicações",
    component: <AppManagerPage />,
    admin: true,
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
