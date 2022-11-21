import { createContext, useContext, useEffect, useState } from "react";
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

const HassContext = createContext<{
  user: HassUser;
  states: HassEntities;
} | null>(null);

export function HassProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<HassUser>();
  const [states, setStates] = useState<HassEntities>();

  useEffect(() => {
    setupHASS({
      onStatesChange: (states) => {
        setStates(states);
      },
    }).then(({ user, states }) => {
      setUser(user);
      setStates(states);
    });
  }, []);

  if (!user || !states) {
    return null;
  }

  return (
    <HassContext.Provider value={{ user, states }}>
      {children}
    </HassContext.Provider>
  );
}

export function useHass() {
  const context = useContext(HassContext);

  if (!context) {
    throw new Error("Must be called inside a HassProvider");
  }

  return context;
}

export function fetchStreamUrl(entityId: string): Promise<string> {
  return _connection!
    .sendMessagePromise({
      type: "camera/stream",
      entity_id: entityId,
    })
    .then((res: any) => res.url);
}
