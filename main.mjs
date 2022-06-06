import { css } from "./utils/general.mjs";
import { h, render } from "./utils/preact.mjs";
import { getHass, HassProvider, hideAppHeader } from "./utils/hass.mjs";
import App from "./App.mjs";

css(`
  html { box-sizing: border-box; }
  *, *:before, *:after { box-sizing: inherit; }

  body {
    margin: 0;
    padding: 16px;
    background-image: url('/local/themes/visualglitch91/background.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
    color: white;
    font-family: Raleway;
  }

  html {
    --scrollbarBG: transparent;
    --thumbBG: #f64270;
  }
`);

const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

if (!isTouchDevice) {
  css(`body { height: 100vh }`);
  new SimpleBar(document.body);
}

let prevHass = null;

const app = document.getElementById("app");

function update(force) {
  const hass = getHass();

  if (hass && (force || prevHass !== hass)) {
    const { user, states } = hass;
    const isAdmin = user.is_admin;

    prevHass = hass;

    render(
      h`<${HassProvider} value=${{ user, states, isAdmin }}>
          <${App} />
        </${HassProvider}>`,
      app
    );
  }

  setTimeout(update, 100);
}

window.addEventListener("focus", () => update(true));
window.addEventListener("resize", () => update(true));
hideAppHeader();
update();
