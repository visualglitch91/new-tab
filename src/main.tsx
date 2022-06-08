import { render } from "preact";
import SimpleBar from "simplebar";
import { HassProvider } from "./utils/hass";
import { autoUpdater } from "./utils/general";
import App from "./App";

autoUpdater();

const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  //@ts-expect-error Bad browser typings
  navigator.msMaxTouchPoints > 0;

const app = document.getElementById("app");

if (!app) {
  throw new Error("#app node not found");
}

const root = app;
const simplebar = !isTouchDevice ? new SimpleBar(root) : undefined;

function update() {
  render(
    <HassProvider>
      <App />
    </HassProvider>,
    root
  );

  if (simplebar) {
    simplebar.recalculate();
  }
}

window.location.hash = "";
window.addEventListener("focus", () => update());
window.addEventListener("resize", () => update());
update();
