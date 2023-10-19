import version from "../version.json";
import { setSearchParam } from "./url";
import { mode } from "./general";

export async function clearAllCachesAndReload() {
  const registration = await navigator.serviceWorker?.getRegistration();

  if (registration) {
    registration.unregister();
  }

  if (window.caches) {
    await window.caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => window.caches.delete(key)));
    });
  }

  window.location.assign(
    setSearchParam({
      mode,
      reload: Date.now(),
    })
  );
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
        clearAllCachesAndReload();
      }
    });
}
