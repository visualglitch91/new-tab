import { useState } from "react";
import { Button, Stack, Switch } from "@mui/material";
import { useSocketIO } from "../utils/api";
import useMountEffect from "../utils/useMountEffect";
import { clearAllCachesAndReload } from "../utils/updater";
import { getConfig, setConfig } from "../utils/useConfig";
import version from "../version.json";
import AltIconButton from "./AltIconButton";
import ListSection from "./ListSection";
import ListItem from "./ListItem";
import Icon from "./Icon";

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

  function onWallpaperChange(e?: React.ChangeEvent<HTMLInputElement>) {
    const file = e?.currentTarget.files?.[0];

    if (!file) {
      setConfig("wallpaper", undefined);
      window.location.reload();
      return;
    }

    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        setConfig("wallpaper", reader.result as string);
        window.location.reload();
      },
      false
    );

    reader.readAsDataURL(file);
  }

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
      <ListItem
        icon="wallpaper"
        primaryText="Papel de Parede"
        endSlot={
          <Stack direction="row" spacing={1} alignItems="center">
            <AltIconButton component="label">
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onWallpaperChange}
              />
              <Icon icon="upload" />
            </AltIconButton>
            {getConfig("wallpaper") && (
              <AltIconButton onClick={() => onWallpaperChange()}>
                <Icon icon="close" />
              </AltIconButton>
            )}
          </Stack>
        }
      />
    </ListSection>
  );
}
