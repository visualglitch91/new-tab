import { PaletteColors } from "$app/theme/palette";
import Bookmarks from "$app/components/Bookmarks";
import { getNextBanner } from "$app/components/DesktopPage/Banner";
import HomePage from "./pages/Home";
import TimersPage from "./pages/Timers";
import SchedulesPage from "./pages/Schedules";
import SysAdminPage from "./pages/SysAdmin";

const routes: {
  path: string;
  label: string;
  color: PaletteColors;
  banner: string;
  component: React.ComponentType;
  admin?: boolean;
}[] = [
  {
    path: "/desktop",
    label: "Bookmarks",
    color: "red",
    banner: getNextBanner(),
    component: Bookmarks,
    admin: true,
  },
  {
    path: "/desktop/home",
    label: "Casa",
    color: "green",
    banner: getNextBanner(),
    component: HomePage,
  },
  {
    path: "/desktop/timers",
    label: "Timers",
    color: "teal",
    banner: getNextBanner(),
    component: TimersPage,
  },
  {
    path: "/desktop/schedules",
    label: "Agendamentos",
    color: "peach",
    banner: getNextBanner(),
    component: SchedulesPage,
  },
  {
    path: "/desktop/system",
    label: "Sistema",
    color: "mauve",
    banner: getNextBanner(),
    component: SysAdminPage,
    admin: true,
  },
];

export default routes;
