import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "./utils/disableEmotionWarning";
import { autoUpdater } from "./utils/updater";
import { isAndroidLauncher } from "./utils/general";
import App from "./App";
import "./styles.css";

autoUpdater();
disableEmotionWarnings();
createRoot(document.getElementById("app")!).render(<App />);

document.addEventListener("focus", autoUpdater);

// if (isAndroidLauncher) {
document.body.classList.add("android-launcher");
// }
