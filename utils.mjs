import htm from "./vendor/htm@3.1.1.mjs";

const { render, createContext } = window.preact;

const { useContext, useEffect, useState, useCallback, useRef } =
  window.preactHooks;

export const h = htm.bind(window.preact.h);

export function css(value) {
  const style = document.createElement("style");
  style.innerHTML = value;
  document.head.appendChild(style);
}

export function clsx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const HassContext = createContext({});

export const HassProvider = HassContext.Provider;

export function useHass() {
  return useContext(HassContext);
}

export { render, useEffect, useState, useCallback, useRef };

export function useRerender() {
  const [, setCounter] = useState(() => Date.now());

  return useCallback(() => {
    setCounter(Date.now());
  });
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function $$$(selector, rootNode = document.body) {
  const arr = [];

  const traverser = (node) => {
    // 1. decline all nodes that are not elements
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    // 2. add the node to the array, if it matches the selector
    if (node.matches(selector)) {
      arr.push(node);
    }

    // 3. loop through the children
    const children = node.children;
    if (children.length) {
      for (const child of children) {
        traverser(child);
      }
    }

    // 4. check for shadow DOM, and loop through it's children
    const shadowRoot = node.shadowRoot;
    if (shadowRoot) {
      const shadowChildren = shadowRoot.children;
      for (const shadowChild of shadowChildren) {
        traverser(shadowChild);
      }
    }
  };

  traverser(rootNode);

  return arr;
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
