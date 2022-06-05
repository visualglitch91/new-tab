import { css } from "./utils/general.mjs";
import { h, render } from "./utils/preact.mjs";
import { getHass, HassProvider, hideAppHeader } from "./utils/hass.mjs";
import App from "./App.mjs";

css(`
  html { box-sizing: border-box; }
  *, *:before, *:after { box-sizing: inherit; }

  body {
    margin: 0;
    padding: 24px;
    background-image: url('/local/themes/visualglitch91/background.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
    color: white;
    font-family: Raleway;
  }
`);

const app = document.getElementById("app");

function update() {
  const { user, states } = getHass();
  const isAdmin = user.is_admin;

  render(
    h`<${HassProvider} value=${{ user, states, isAdmin }}>
        <${App} />
      </${HassProvider}>`,
    app
  );

  setTimeout(update, 100);
}

hideAppHeader();
update();
