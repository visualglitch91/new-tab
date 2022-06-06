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

  br {
    content: "";
    height: 4px;
    display: block;
  }
`);

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

window.addEventListener("resize", () => update(true));
hideAppHeader();
update();
