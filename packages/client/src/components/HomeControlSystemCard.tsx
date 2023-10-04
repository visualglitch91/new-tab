import { useState } from "react";
import { useSocketIO } from "../utils/api";
import useMountEffect from "../utils/useMountEffect";
import { clearAllCachesAndReload } from "../utils/updater";
import version from "../version.json";
import AltIconButton from "./AltIconButton";
import ListSection from "./ListSection";
import ListItem from "./ListItem";
import Icon from "./Icon";

export default function HomeControlSystemCard() {
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
          <AltIconButton onClick={clearAllCachesAndReload}>
            <Icon icon="refresh" />
          </AltIconButton>
        </>
      }
    >
      <ListItem icon="numeric" primaryText="Versão" endSlot={version} />
      <ListItem
        icon="connection"
        primaryText="WebSocket"
        endSlot={isWebsocket ? "Sim" : "Não"}
      />
    </ListSection>
  );
}
