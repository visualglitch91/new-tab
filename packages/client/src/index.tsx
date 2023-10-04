import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "./utils/disableEmotionWarning";
import "./styles.css";
import App from "./App";

disableEmotionWarnings();
createRoot(document.getElementById("app")!).render(<App />);
