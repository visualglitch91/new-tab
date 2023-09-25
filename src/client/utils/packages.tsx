import { createContext, useContext, useEffect, useState } from "react";
import EventEmitter from "./EventEmitter";
import { hassUrl } from "./hass";
import { Package } from "./typings";

class PackageStore {
  private emitter = new EventEmitter();
  public packages: Package[] | undefined;

  refresh() {
    return fetch(`${hassUrl}/local/correios.json?timestamp=${Date.now()}`)
      .then((res) => res.json())
      .catch(() => [])
      .then((json) => {
        this.packages = json;
        this.emitter.emit("update", json);
      });
  }

  setup() {
    return this.refresh();
  }

  subscribe(callback: (packages: Package[]) => void) {
    return this.emitter.on("update", callback);
  }

  getPackages() {
    return this.packages;
  }
}

const PackagesContext = createContext<PackageStore | undefined>(undefined);

export function PackagesProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<PackageStore>();

  useEffect(() => {
    const store = new PackageStore();

    store.setup().then(() => {
      setStore(store);
    });
  }, []);

  if (!store) {
    return null;
  }

  return (
    <PackagesContext.Provider value={store}>
      {children}
    </PackagesContext.Provider>
  );
}
function usePackageStore() {
  const store = useContext(PackagesContext);

  if (!store) {
    throw new Error("PackagesProvider not ready");
  }

  return store;
}

export function usePackages() {
  const store = usePackageStore();
  const [packages, setPackages] = useState<Package[]>(() => {
    const packages = store.getPackages();

    if (!packages) {
      throw new Error("PackagesProvider not ready");
    }

    return packages;
  });

  useEffect(() => {
    return store.subscribe(setPackages);
  }, [store]);

  if (!packages) {
    throw new Error("PackagesProvider not ready");
  }

  return {
    packages,
    refresh: () => {
      store.refresh();
    },
  };
}
