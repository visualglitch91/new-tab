import htm from "./vendor/htm.mjs";

const { h: preactH, render, createContext } = window.preact;
const { useContext, useEffect, useState, useCallback, useRef } =
  window.preactHooks;

export const h = htm.bind(preactH);

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

export function getIcon(deviceClass, state) {
  return "mdi:ghost";
}

export function useRerender() {
  const [, setCounter] = useState(() => Date.now());

  return useCallback(() => {
    setCounter(Date.now());
  });
}
