import { PaletteColors } from "$app/theme/palette";
import Bookmarks from "$app/components/Bookmarks";
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
    banner: "cbg-13.gif",
    component: Bookmarks,
    admin: true,
  },
  {
    path: "/desktop/home",
    label: "Casa",
    color: "green",
    banner: "howls-lofi.gif",
    component: HomePage,
  },
  {
    path: "/desktop/timers",
    label: "Timers",
    color: "teal",
    banner: "cbg-10.gif",
    component: TimersPage,
  },
  {
    path: "/desktop/schedules",
    label: "Agendamentos",
    color: "peach",
    banner: "cbg-03.gif",
    component: SchedulesPage,
  },
  {
    path: "/desktop/system",
    label: "Sistema",
    color: "mauve",
    banner: "cbg-07.gif",
    component: SysAdminPage,
    admin: true,
  },
];

export default routes;
