import { createContext, useContext, useEffect, useState } from "react";
import EventEmitter from "events";
//@ts-expect-error
import diff from "diff-arrays-of-objects";
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
} from "home-assistant-js-websocket";
import { loadValue, saveValue } from "./general";

let _connection: Connection | undefined;

export type EntityMap = Record<string, HassEntity | undefined>;

export const hassUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_HASS_DEVELOPMENT_URL
    : window.location.origin;

function setupHASS({
  onStatesChange,
}: {
  onStatesChange: (states: HassEntity[]) => void;
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

      subscribeEntities(connection, (stateMap) => {
        onStatesChange(Object.values(stateMap));
      });

      return Promise.all([getUser(connection), getStates(connection)]);
    })
    .then(([user, states]) => ({
      user,
      states,
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
  public user: HassUser | undefined;
  public states: HassEntity[] = [];

  setup() {
    this.emitter.setMaxListeners(Infinity);

    return setupHASS({
      onStatesChange: (states) => {
        this.updateStates(states);
      },
    }).then(({ user, states }) => {
      this.updateStates(states);
      this.updateUser(user);
    });
  }

  private updateStates(states: HassEntity[]) {
    const changes: {
      added: HassEntity[];
      updated: HassEntity[];
      removed: HassEntity[];
    } = diff(this.states, states, "entity_id");

    this.states = states;

    [...changes.added, ...changes.updated].forEach((it) => {
      this.emitter.emit(`entity:${it.entity_id}`, it);
    });

    changes.removed.forEach((it) => {
      this.emitter.emit(`entity:${it.entity_id}`, undefined);
    });
  }

  private updateUser(user: HassUser) {
    this.user = user;
    this.emitter.emit("user", user);
  }

  subscribeToUser(callback: (user: HassUser) => void) {
    this.emitter.on("user", callback);

    return () => {
      this.emitter.off("user", callback);
    };
  }

  subscribeToEntity(
    entityId: string,
    callback: (state: HassEntity | undefined) => void
  ) {
    const eventName = `entity:${entityId}`;

    this.emitter.on(eventName, callback);

    return () => {
      this.emitter.off(eventName, callback);
    };
  }
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

export function useEntities(...entityIds: string[]) {
  const store = useHassStore();
  const stringifiedEntityIds = JSON.stringify(entityIds);

  const [states, setStates] = useState(() => {
    return store.states.reduce((acc, entity) => {
      if (!entityIds.includes(entity.entity_id)) {
        return acc;
      }

      return { ...acc, [entity.entity_id]: entity };
    }, {} as EntityMap);
  });

  useEffect(() => {
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

export function useEntity(entityId: string) {
  const states = useEntities(entityId);
  return states[entityId];
}
