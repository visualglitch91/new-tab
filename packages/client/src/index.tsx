import { navigate } from "wouter/use-location";
import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "./utils/disableEmotionWarning";
import { autoUpdater } from "./utils/updater";
import App from "./App";
import "./styles.css";
import { isAndroidLauncher } from "./utils/general";

autoUpdater();
disableEmotionWarnings();
createRoot(document.getElementById("app")!).render(<App />);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    autoUpdater();

    if (isAndroidLauncher) {
      navigate("/mobile/dashboard");
    }
  }
});
