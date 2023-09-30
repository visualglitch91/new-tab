import { createRoot } from "react-dom/client";
import "./styles.css";
import Main from "./Main";
import { removeParamsFromUrl } from "./utils/general";

removeParamsFromUrl(["reload"]);

createRoot(document.getElementById("app")!).render(<Main />);
