import { h, css, render, HassProvider } from "./utils.mjs";
import App from "./App.mjs";

const app = document.getElementById("app");

function getHass() {
  const element = window.parent.document.querySelector("home-assistant");
  return element.__hass;
}

function callService(domain, service, data) {
  return getHass().callService(domain, service, data);
}

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


function update() {
  const states = getHass().states;

  render(
    h`
    <${HassProvider} value=${{ states, callService }}>
      <${App} />
    </${HassProvider}>
    `,
    app
  );

  setTimeout(update, 100);
}

update();
