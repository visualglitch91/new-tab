import { useState } from "react";
import { Switch } from "@mui/material";
import { useSocketIO } from "$client/utils/api";
import useMountEffect from "$client/utils/useMountEffect";
import { clearAllCachesAndReload } from "$client/utils/updater";
import { getConfig, setConfig } from "$client/utils/useConfig";
import version from "$client/version.json";
import AltIconButton from "./AltIconButton";
import ListSection from "./ListSection";
import ListItem from "./ListItem";

export default function HomeControlCard() {
  const socket = useSocketIO();

  const checkWebSocket = () =>
    //@ts-expect-error
    socket.io.engine.transport.ws instanceof WebSocket;

  const [isWebsocket, setIsWebsocket] = useState(checkWebSocket);

  useMountEffect(() => {
    const interval = setInterval(() => setIsWebsocket(checkWebSocket), 5000);
    return () => clearInterval(interval);
  });

  return (
    <ListSection
      title={
        <>
          <span>Home Control</span>
          <AltIconButton icon="refresh" onClick={clearAllCachesAndReload} />
        </>
      }
    >
      <ListItem icon="numeric" primaryText="Versão" endSlot={version} />
      <ListItem
        icon="connection"
        primaryText="WebSocket"
        endSlot={isWebsocket ? "Sim" : "Não"}
      />
      <ListItem
        icon="shimmer"
        primaryText="Efeitos de Blur"
        endSlot={
          <Switch
            defaultChecked={!getConfig("disableBlurEffects")}
            onChange={(_, checked) => {
              setConfig("disableBlurEffects", !checked);
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }}
          />
        }
      />
    </ListSection>
  );
}
