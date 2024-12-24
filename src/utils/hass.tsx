/* eslint "react-refresh/only-export-components": "off" */
import { createContext, useContext, useEffect, useState } from "react";
import {
  getUser,
  getAuth,
  callService as _callService,
  createConnection,
  getStates,
  subscribeEntities,
  HassEntity,
  HassUser,
  Connection,
  MessageBase,
} from "home-assistant-js-websocket";
import EventEmitter from "./EventEmitter";
import { removeParamsFromUrl } from "./url";
import { loadValue, saveValue, clearValue } from "./storage";
import api from "./api";

let _connection: Connection | undefined;

export type HassEntityMap = Record<string, HassEntity | undefined>;

export const hassUrl = process.env.HASS_URL;

function setupHASS({
  onStatesChange,
}: {
  onStatesChange: (states: HassEntity[]) => void;
}) {
  return getAuth({
    hassUrl,
    redirectUrl: window.location.origin,
    saveTokens: (tokens) => saveValue(`hass_token_${hassUrl}`, tokens),
    loadTokens: async () => loadValue(`hass_token_${hassUrl}`),
  })
    .then((auth) => createConnection({ auth }))
    .then((connection) => {
      _connection = connection;

      removeParamsFromUrl(["code", "state", "auth_callback"]);

      subscribeEntities(connection, (stateMap) => {
        onStatesChange(Object.values(stateMap));
      });

      return Promise.all([getUser(connection), getStates(connection)]);
    })
    .then(([user, states]) => ({
      user,
      states,
    }))
    .catch((err) => {
      console.error(err);
      setTimeout(() => {
        clearValue(`hass_token_${hassUrl}`);
        window.location.reload();
      }, 1);

      throw err;
    });
}

export function getAccessToken() {
  const token = _connection?.options.auth?.accessToken;

  if (!token) {
    throw new Error("token not available yet");
  }

  return token;
}

export function getIcon(entity: HassEntity) {
  if (entity) {
    const { state, entity_id } = entity;
    const [domain] = entity_id.split(".");
    const icon = entity.attributes?.icon;
    const deviceClass = entity.attributes?.device_class;

    if (icon) {
      return icon;
    }

    switch (deviceClass) {
      case "timestamp":
        return "mdi:clock";
    }

    switch (domain) {
      case "light":
        return "mdi:lightbulb";
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
      case "media_player":
        return "mdi:television";
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

export function makeServiceCall(domain: string, service: string, data?: any) {
  return () => {
    callService(domain, service, data);
  };
}

export function makeTurnOnCall(entityId: string) {
  return entityId.startsWith("button")
    ? makeServiceCall("button", "press", { entity_id: entityId })
    : entityId.startsWith("input_button")
    ? makeServiceCall("input_button", "press", { entity_id: entityId })
    : makeServiceCall("homeassistant", "turn_on", { entity_id: entityId });
}

export function makeWebOSCall(service: string, entityId: string, data: any) {
  return makeServiceCall("webostv", service, {
    entity_id: entityId,
    ...data,
  });
}

class HassStore {
  private emitter = new EventEmitter();
  public user: HassUser | undefined;
  public states: HassEntity[] = [];

  setup() {
    const setupPromise = setupHASS({
      onStatesChange: (states) => {
        this.updateStates(states);
      },
    }).then(({ user, states }) => {
      this.updateStates(states);
      this.updateUser(user);
    });

    return setupPromise;
  }

  private updateStates(newStates: HassEntity[]) {
    const allIdsSet = new Set<string>();
    const currentStateMap: HassEntityMap = {};
    const nextStateMap: HassEntityMap = {};

    this.states.forEach((entity) => {
      allIdsSet.add(entity.entity_id);
      currentStateMap[entity.entity_id] = entity;
    });

    newStates.forEach((entity) => {
      allIdsSet.add(entity.entity_id);
      nextStateMap[entity.entity_id] = entity;
    });

    this.states = Object.values(nextStateMap) as HassEntity[];

    allIdsSet.forEach((entityId) => {
      const currentEntity = currentStateMap[entityId];
      const nextEntity = nextStateMap[entityId];

      if (
        currentEntity?.last_updated !== nextEntity?.last_updated ||
        currentEntity?.last_changed !== nextEntity?.last_changed
      ) {
        this.emitter.emit(`entity:${entityId}`, nextEntity);
      }
    });
  }

  private updateUser(user: HassUser) {
    this.user = user;
    this.emitter.emit("user", user);
  }

  subscribeToUser(callback: (user: HassUser) => void) {
    return this.emitter.on("user", callback);
  }

  subscribeToEntity(
    entityId: string,
    callback: (state: HassEntity | undefined) => void
  ) {
    return this.emitter.on(`entity:${entityId}`, callback);
  }
}

const HassContext = createContext<HassStore | undefined>(undefined);

export function HassProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<HassStore>();

  useEffect(() => {
    const store = new HassStore();

    store.setup().then(() => {
      setStore(store);
      api("/app-manager/apps", "get");
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

export function useUser() {
  const store = useHassStore();
  const [user, setUser] = useState<HassUser | undefined>(store.user);

  useEffect(() => {
    return store.subscribeToUser(setUser);
  }, [store]);

  if (!user) {
    throw new Error("HassStore not ready");
  }

  return user;
}

export function useIsAdmin() {
  return useUser().is_admin;
}

export function useEntities(...entityIds: string[]) {
  const store = useHassStore();
  const stringifiedEntityIds = JSON.stringify(entityIds);

  function getInitialState() {
    return store.states.reduce((acc, entity) => {
      if (!entityIds.includes(entity.entity_id)) {
        return acc;
      }

      return { ...acc, [entity.entity_id]: entity };
    }, {} as HassEntityMap);
  }

  const [states, setStates] = useState(getInitialState);

  useEffect(() => {
    setStates(getInitialState);

    const unsubscribers = entityIds.map((entityId) => {
      return store.subscribeToEntity(entityId, (state) => {
        setStates((prev) => ({ ...prev, [entityId]: state }));
      });
    });

    return () => {
      unsubscribers.map((it) => it());
    };
    //eslint-disable-next-line
  }, [store, stringifiedEntityIds]);

  return states;
}

export function useEntity<T = HassEntity>(entityId: string) {
  const states = useEntities(entityId);
  return states[entityId] as T | undefined;
}

export function sendMessage<T>(message: MessageBase) {
  if (!_connection) {
    throw new Error("Hass Connection not set up");
  }

  return _connection.sendMessagePromise<T>(message);
}
