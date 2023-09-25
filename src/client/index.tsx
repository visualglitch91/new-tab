import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { HassProvider } from "./utils/hass";
// import { PackagesProvider } from "./utils/packages";
import {
  autoUpdater,
  isTouchDevice,
  loadCordovaJS,
  ResponsiveProvider,
} from "./utils/general";
import App from "./App";
import "./styles.css";
import { appendStyle, theme } from "./styling";

const root = createRoot(document.getElementById("app")!);

appendStyle(`
  @media only screen and (max-width: 600px) {
    body {
      background-size: cover;
      background-image: url(${theme.wallpaper.mobile});
    }
  }

  @media only screen and (min-width: 601px) {
    body {
      background-size: cover;
      background-image: url(${theme.wallpaper.desktop});
    }
  }
`);

async function setup() {
  await loadCordovaJS();

  autoUpdater();

  window.location.hash = "";
  document.addEventListener("resume", autoUpdater);
  window.addEventListener("focus", autoUpdater);

  if (isTouchDevice) {
    window.oncontextmenu = () => false;
    document.body.classList.add("touch-device");
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
        {/* <PackagesProvider> */}
        <App />
        {/* </PackagesProvider> */}
      </HassProvider>
    </ResponsiveProvider>
  ) : null;
}

root.render(<Main />);
