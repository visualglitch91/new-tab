import { createRoot } from "react-dom/client";
import type SimpleBar from "simplebar";
import { HassProvider } from "./utils/hass";
import {
  autoUpdater,
  isTouchDevice,
  loadCordovaJS,
  ResponsiveProvider,
} from "./utils/general";
import App from "./App";
import "./styles.css";

autoUpdater();

const app = document.getElementById("app")!;
const root = createRoot(app);
let simplebar: SimpleBar;

if (isTouchDevice) {
  window.oncontextmenu = () => false;
  document.body.classList.add("touch-device");
} else {
  import("simplebar").then(({ default: SimpleBar }) => {
    simplebar = new SimpleBar(app);
  });
}

function renderApp() {
  root.render(
    <ResponsiveProvider>
      <HassProvider>
        <App />
      </HassProvider>
    </ResponsiveProvider>
  );

  if (simplebar) {
    simplebar.recalculate();
  }
}

loadCordovaJS().then(() => {
  window.location.hash = "";

  document.addEventListener("resume", autoUpdater);
  document.addEventListener("resume", renderApp);

  window.addEventListener("focus", autoUpdater);
  window.addEventListener("focus", renderApp);

  window.addEventListener("resize", renderApp);

  renderApp();
});
