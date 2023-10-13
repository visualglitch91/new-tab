import { navigate } from "wouter/use-location";
import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "./utils/disableEmotionWarning";
import { autoUpdater } from "./utils/updater";
import { isAndroidLauncher } from "./utils/general";
import { getConfig } from "./utils/useConfig";
import App from "./App";
import "./styles.css";

const wallpaper = getConfig("wallpaper");

if (wallpaper) {
  document.body.style.backgroundImage = `url(${wallpaper})`;
}

window.addEventListener("focus", () => {
  autoUpdater();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    autoUpdater();

    if (isAndroidLauncher) {
      navigate("/mobile/dashboard");
    }
  }
});

autoUpdater();
disableEmotionWarnings();
createRoot(document.getElementById("app")!).render(<App />);
