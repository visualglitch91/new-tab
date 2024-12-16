import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "$app/utils/disableEmotionWarning";
import { autoUpdater } from "$app/utils/updater";
import App from "./App";
import "./styles.css";

window.addEventListener("focus", () => {
  autoUpdater();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    autoUpdater();
  }
});

autoUpdater();
disableEmotionWarnings();
createRoot(document.getElementById("root")!).render(<App />);
