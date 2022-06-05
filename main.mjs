import { h, css, render, $$$, HassProvider } from "./utils.mjs";
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

let _toggleSidebar = null;
const app = document.getElementById("app");

function getHass() {
  const element = window.parent.document.querySelector("home-assistant");
  return element.__hass;
}

function callService(domain, service, data) {
  return getHass().callService(domain, service, data);
}

function hideAppHeader() {
  const iframePanel = $$$(
    "ha-panel-iframe",
    window.parent.document.querySelector("home-assistant")
  )[0];

  const subpage = $$$("hass-subpage", iframePanel)[0];
  const [toolbar, content] = Array.from(subpage.shadowRoot.children);

  toolbar.style.display = "none";
  content.style.height = "100%";

  const sidebarToggle = $$$('button[aria-label="Sidebar Toggle"]', toolbar)[0];

  _toggleSidebar = () => {
    sidebarToggle.click();
  };
}

function toggleSidebar() {
  if (_toggleSidebar) {
    _toggleSidebar();
  }
}

function update() {
  const { user, states } = getHass();
  const isAdmin = user.is_admin;

  render(
    h`<${HassProvider}
        value=${{
          user,
          isAdmin,
          states,
          toggleSidebar,
          callService,
        }}
      >
        <${App} />
      </${HassProvider}>`,
    app
  );

  setTimeout(update, 100);
}

hideAppHeader();
update();
