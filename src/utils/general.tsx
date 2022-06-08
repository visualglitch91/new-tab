import { ComponentChildren, render } from "preact";

export function clsx(...classes: (string | null | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function compact<T>(array: (T | false | null | undefined | 0)[]) {
  return array.filter(Boolean) as T[];
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait = 200
) {
  let timer: number;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = window.setTimeout(() => func(...args), wait);
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  //eslint-disable-next-line
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function renderModal(
  renderer: (unmount: () => void) => ComponentChildren
) {
  const modal = document.createElement("div");
  document.body.appendChild(modal);

  function unmount() {
    render(null, modal);
    modal.remove();
  }

  render(renderer(unmount), modal);
}

export function saveValue(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadValue<T>(key: string): T | undefined {
  try {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(data) : undefined;
  } catch (_) {
    return undefined;
  }
}
