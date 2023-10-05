import { lazy } from "react";
import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "./utils/disableEmotionWarning";
import "./styles.css";
import devicePerformance from "./utils/devicePerformance";

const LazyApp = lazy(() => import("./App"));

disableEmotionWarnings();

devicePerformance.setup().then(() => {
  createRoot(document.getElementById("app")!).render(<LazyApp />);
});
