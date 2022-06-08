import { render } from "preact";
import SimpleBar from "simplebar";
import { HassProvider } from "./utils/hass";
import App from "./App";

const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  //@ts-expect-error
  navigator.msMaxTouchPoints > 0;

const root = document.getElementById("app")!;
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
