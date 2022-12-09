import { render } from "preact";
import { useEffect, useState } from "react";
import { HassProvider } from "./utils/hass";
import { PackagesProvider } from "./utils/packages";
import {
  autoUpdater,
  isTouchDevice,
  loadCordovaJS,
  ResponsiveProvider,
} from "./utils/general";
import App from "./App";
import "./styles.css";

const app = document.getElementById("app")!;

async function setup() {
  await loadCordovaJS();

  autoUpdater();

  window.location.hash = "";
  document.addEventListener("resume", autoUpdater);
  window.addEventListener("focus", autoUpdater);

  if (isTouchDevice) {
    window.oncontextmenu = () => false;
    document.body.classList.add("touch-device");
  } else {
    const SimpleBar = await import("simplebar").then((res) => res.default);
    const simplebar = new SimpleBar(app);
    const recalculate = () => simplebar.recalculate();

    document.addEventListener("resume", recalculate);
    window.addEventListener("focus", recalculate);
    window.addEventListener("resize", recalculate);
  }
}

function Main() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      return;
    }

    setup().then(() => setReady(true));
    //eslint-disable-next-line
  }, []);

  return ready ? (
    <ResponsiveProvider>
      <HassProvider>
        <PackagesProvider>
          <App />
        </PackagesProvider>
      </HassProvider>
    </ResponsiveProvider>
  ) : null;
}

render(<Main />, app);
