import { $$$ } from "./general.mjs";
import { useContext, createContext } from "./preact.mjs";

let _toggleSidebar = null;
const parentDocument = window.parent.document;

const HassContext = createContext({});

export const HassProvider = HassContext.Provider;

export function useHass() {
  return useContext(HassContext);
}

export function getHass() {
  const element = parentDocument.querySelector("home-assistant");
  return element.__hass;
}

window.getHass = getHass;

export function hideAppHeader() {
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

export function toggleSidebar() {
  if (_toggleSidebar) {
    _toggleSidebar();
  }
}

export function getIcon(entity) {
  if (entity) {
    const { state, entity_id } = entity;
    const [domain] = entity_id.split(".");

    switch (domain) {
      case "input_boolean":
        if (state === "on") {
          return "mdi:check-circle-outline";
        } else if (state === "off") {
          return "mdi:close-circle-outline";
        }
      case "vacuum":
        return "mdi:robot-vacuum";
      case "script":
        return "mdi:code-braces";
    }
  }

  return "mdi:ghost";
}

export function callService(domain, service, data) {
  console.log({ domain, service, data });
  return getHass().callService(domain, service, data);
}

export function makeServiceCall(domain, service, data) {
  return () => callService(domain, service, data);
}

export function makeTurnOnCall(entityId) {
  return makeServiceCall("homeassistant", "turn_on", { entity_id: entityId });
}

export function makeWebOSCall(service, entityId, data) {
  return makeServiceCall("webostv", service, {
    entity_id: entityId,
    ...data,
  });
}

export function showMoreInfo(entityId) {
  console.log("showMoreInfo", entityId);
  const element = parentDocument.createElement("ha-more-info-dialog");

  element.hass = getHass();
  element._entityId = entityId;

  element.addEventListener("dialog-closed", () => {
    element.remove();
  });

  parentDocument.body.appendChild(element);
}
