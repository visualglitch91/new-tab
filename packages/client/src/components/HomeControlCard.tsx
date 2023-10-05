import { useState } from "react";
import { useSocketIO } from "../utils/api";
import useMountEffect from "../utils/useMountEffect";
import { clearAllCachesAndReload } from "../utils/updater";
import version from "../version.json";
import AltIconButton from "./AltIconButton";
import ListSection from "./ListSection";
import ListItem from "./ListItem";
import Icon from "./Icon";
import useConfirm from "../utils/useConfirm";
import { getConfig, setConfig } from "../utils/useConfig";
import { Switch } from "@mui/material";

export default function HomeControlCard() {
  const socket = useSocketIO();
  const confirm = useConfirm();

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
      <ListItem
        icon="gauge"
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
