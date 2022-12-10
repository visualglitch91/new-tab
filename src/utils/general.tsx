import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";
import version from "../version.json";

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

export function rgbToHex([r, g, b]: RGB) {
  //eslint-disable-next-line
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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

export function autoUpdater() {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  console.log(`Looking for a new version, current is ${version}`);

  fetch(`./latest.json?c=${Date.now()}`)
    .then((res) => res.json())
    .catch(() => undefined)
    .then(async (latest) => {
      if (latest && latest !== version) {
        console.log(`Loading the new version ${latest}`);

        const registration = await navigator.serviceWorker?.getRegistration();

        if (registration) {
          registration.unregister();
        }

        if (caches) {
          await caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => caches.delete(key)));
          });
        }

        const url = new URL(window.location.href);
        url.searchParams.set("version", latest);
        window.location.assign(url);
      }
    });
}

export function loadCordovaJS() {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://localhost/cordova.js";

    script.onload = () => {
      document.addEventListener("deviceready", onDeviceReady, false);

      function onDeviceReady() {
        const NavigationBar = (window as any).NavigationBar;
        const StatusBar = (window as any).StatusBar;

        document.body.classList.add("statusbar-overlay");

        NavigationBar.show();
        NavigationBar.backgroundColorByHexString("#24324b");

        window.addEventListener("keyboardWillShow", () => {
          StatusBar.overlaysWebView(false);
          document.body.classList.remove("statusbar-overlay");
        });

        window.addEventListener("keyboardWillHide", () => {
          StatusBar.overlaysWebView(true);
          document.body.classList.add("statusbar-overlay");
        });

        resolve(true);
      }
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T
) {
  const callbackRef = useRef(callback);

  return useMemo(() => {
    return debounce((...args) => {
      callbackRef.current(...args);
    });
  }, []) as T;
}

export const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  //@ts-expect-error Bad browser typings
  navigator.msMaxTouchPoints > 0;

export function formatNumericValue(value: string | number, suffix: string) {
  const formatted = (Math.round(Number(value) * 10) / 10).toFixed(1);
  return `${formatted}${suffix}`;
}

export type RGB = [number, number, number];

export function getContrastColor(color: RGB) {
  // https://stackoverflow.com/a/3943023/112731
  return color[0] * 0.299 + color[1] * 0.587 + color[2] * 0.114 > 186
    ? "#000000"
    : "#FFFFFF";
}

const ResponsiveContext = createContext<
  { isMobile: boolean; isDesktop: boolean } | undefined
>(undefined);

function isMobile() {
  const minWidth = 655;
  return window.innerWidth < minWidth;
}

export function ResponsiveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobile, setMobile] = useState(isMobile);

  useEffect(() => {
    const handler = debounce(() => setMobile(isMobile()));
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile", mobile);
    document.body.classList.toggle("desktop", !mobile);
  }, [mobile]);

  const value = useMemo(() => {
    return { isMobile: mobile, isDesktop: !mobile };
  }, [mobile]);

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive() {
  const result = useContext(ResponsiveContext);

  if (!result) {
    throw new Error("Must be called inside a ResponsiveProvider");
  }

  return result;
}
