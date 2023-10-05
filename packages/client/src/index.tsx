import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "./utils/disableEmotionWarning";
import App from "./App";
import "./styles.css";

disableEmotionWarnings();
createRoot(document.getElementById("app")!).render(<App />);
