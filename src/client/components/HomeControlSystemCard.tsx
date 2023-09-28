import { useState } from "react";
import { useSocketIO } from "../utils/api";
import useMountEffect from "../utils/useMountEffect";
import version from "../version.json";
import ListCard from "./ListCard";
import ListItem from "./ListItem";
import PillButton from "./PillButton";
import { clearAllCachesAndReload } from "../utils/general";

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
    <ListCard
      title="Home Control"
      titleAction={
        <PillButton icon="refresh" onClick={() => clearAllCachesAndReload()} />
      }
    >
      <ListItem icon="numeric" label="Versão">
        {version}
      </ListItem>
      <ListItem icon="connection" label="WebSocket">
        {isWebsocket ? "Sim" : "Não"}
      </ListItem>
    </ListCard>
  );
}
