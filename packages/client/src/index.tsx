import { lazy } from "react";
import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "./utils/disableEmotionWarning";
import "./styles.css";
import { calculateDevicePerformance } from "./utils/general";

const LazyApp = lazy(() => import("./App"));

disableEmotionWarnings();
calculateDevicePerformance().then(() => {
  createRoot(document.getElementById("app")!).render(<LazyApp />);
});
