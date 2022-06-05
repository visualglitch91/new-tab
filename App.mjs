import { h } from "./utils/preact.mjs";
import { useHass } from "./utils/hass.mjs";
import ColumnarLayout from "./components/ColumnarLayout.mjs";
import tvModule from "./modules/tv.mjs";
import houseModule from "./modules/house.mjs";
import vacuumModule from "./modules/vacuum.mjs";
import camerasModule from "./modules/cameras.mjs";

export default function App() {
  const { isAdmin } = useHass();

  return h`
    <${ColumnarLayout}>
      ${tvModule}
      ${houseModule}
      ${isAdmin && vacuumModule}
      ${isAdmin && camerasModule}
    </${ColumnarLayout}>
  `;
}
