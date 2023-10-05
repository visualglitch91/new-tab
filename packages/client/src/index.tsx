import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "./utils/disableEmotionWarning";
import { autoUpdater } from "./utils/updater";
import App from "./App";
import "./styles.css";

autoUpdater();
disableEmotionWarnings();
createRoot(document.getElementById("app")!).render(<App />);
