import { h, useHass } from "./utils.mjs";
import ColumnarLayout from "./components/ColumnarLayout.mjs";
import SidebarToggle from "./components/SidebarToggle.mjs";
import houseModule from "./modules/house.mjs";
import vacuumModule from "./modules/vacuum.mjs";

export default function App() {
  const { isAdmin } = useHass();

  return h`
    <${ColumnarLayout}>
      ${houseModule}
      ${isAdmin && vacuumModule}
    </${ColumnarLayout}>
    <${SidebarToggle} />
  `;
}
