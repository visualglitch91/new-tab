import { createContext, useContext, useEffect, useState } from "react";
import EventEmitter from "events";
import {
  getUser,
  getAuth,
  callService as _callService,
  createConnection,
  getStates,
  subscribeEntities,
  HassEntity,
  HassEntities,
  HassUser,
  Connection,
} from "home-assistant-js-websocket";
import { loadValue, saveValue } from "./general";

let _connection: Connection | undefined;

export const hassUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_HASS_DEVELOPMENT_URL
    : window.location.origin;

function setupHASS({
  onStatesChange,
}: {
  onStatesChange: (states: HassEntities) => void;
}) {
  return getAuth({
    hassUrl,
    saveTokens: (tokens) => saveValue("hass_token", tokens),
    loadTokens: async () => loadValue("hass_token"),
  })
    .then((auth) => createConnection({ auth }))
    .then((connection) => {
      _connection = connection;

      const url = new URL(window.location.href);

      url.search = "";
      window.history.replaceState(null, "", url.toString());

      subscribeEntities(connection, onStatesChange);

      return Promise.all([getUser(connection), getStates(connection)]);
    })
    .then(([user, states]) => ({
      user,
      states: states.reduce(
        (acc, it) => ({ ...acc, [it.entity_id]: it }),
        {} as HassEntities
      ),
    }));
}

export function getIcon(entity: HassEntity) {
  if (entity) {
    const { state, entity_id } = entity;
    const [domain] = entity_id.split(".");
    const icon = entity.attributes?.icon;

    if (icon) {
      return icon;
    }

    switch (domain) {
      case "input_boolean":
        if (state === "on") {
          return "mdi:check-circle-outline";
        } else if (state === "off") {
          return "mdi:close-circle-outline";
        }
        break;
      case "vacuum":
        return "mdi:robot-vacuum";
      case "script":
        return "mdi:code-braces";
    }
  }

  return "mdi:ghost";
}

export function callService(domain: string, service: string, data: any) {
  if (!_connection) {
    throw new Error("HASS was not set up");
  }

  return _callService(_connection, domain, service, data);
}

export function makeServiceCall(domain: string, service: string, data: any) {
  return () => callService(domain, service, data);
}

export function makeTurnOnCall(entityId: string) {
  return makeServiceCall("homeassistant", "turn_on", { entity_id: entityId });
}

export function makeWebOSCall(service: string, entityId: string, data: any) {
  return makeServiceCall("webostv", service, {
    entity_id: entityId,
    ...data,
  });
}

export function fetchStreamUrl(entityId: string): Promise<string> {
  return _connection!
    .sendMessagePromise({
      type: "camera/stream",
      entity_id: entityId,
    })
    .then((res: any) => res.url);
}

class HassStore {
  private emitter = new EventEmitter();
  private user: HassUser | undefined;
  private states: HassEntities = {};

  setup() {
    return setupHASS({
      onStatesChange: (states) => {
        this.updateStates(states);
      },
    }).then(({ user, states }) => {
      this.updateStates(states);
      this.updateUser(user);
    });
  }

  private updateStates(states: HassEntities) {
    this.states = states;
    this.emitter.emit("state", this.getState());
  }

  private updateUser(user: HassUser) {
    this.user = user;
    this.emitter.emit("state", this.getState());
  }

  getState() {
    return {
      user: this.user,
      states: this.states,
    };
  }

  subscribeToState(
    callback: (state: { user: HassUser; states: HassEntities }) => void
  ) {
    this.emitter.on("state", callback);

    return () => {
      this.emitter.off("state", callback);
    };
  }

  subscribeToUser(callback: (user: HassUser) => void) {}

  subscribeToEntity(
    entityId: string,
    callback: (states: HassEntities) => void
  ) {}
}

const HassContext = createContext<HassStore | undefined>(undefined);

export function HassProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<HassStore>();

  useEffect(() => {
    const store = new HassStore();
    store.setup().then(() => {
      setStore(store);
    });
  }, []);

  if (!store) {
    return null;
  }

  return <HassContext.Provider value={store}>{children}</HassContext.Provider>;
}

export function useHassStore() {
  const store = useContext(HassContext);

  if (!store) {
    throw new Error("Must be called inside a HassProvider");
  }

  return store;
}

export function useHass() {
  const store = useHassStore();
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribeToState(setState);
  }, [store]);

  if (!state.user) {
    throw new Error("HassStore not ready");
  }

  return state as { user: HassUser; states: HassEntities };
}
