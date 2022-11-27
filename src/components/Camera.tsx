import { useEffect, useState } from "react";
import { styled, css } from "../styling";
import { hassUrl, makeServiceCall, useEntity } from "../utils/hass";
import Paper from "./Paper";
import CameraStream from "./CameraStream";
import FlexRow from "./FlexRow";
import PillButton from "./PillButton";

const Wrapper = styled(
  Paper,
  css`
    position: relative;
    min-height: 200px;
    overflow: hidden;

    & img,
    & video {
      width: 100%;
    }
  `
);

const Overlay = styled(
  "div",
  css`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: background 70ms linear;
  `
);

const Buttons = styled(
  FlexRow,
  css`
    padding: 8px 0;
  `
);

export default function Camera({
  stream,
  entityId,
  ptzEntityId,
}: {
  stream: boolean;
  entityId: string;
  ptzEntityId?: string;
}) {
  const entity = useEntity(entityId);
  const entityPicture = entity?.attributes?.entity_picture;
  const [snapshot, setSnapshot] = useState<string>();

  function pan(direction: "LEFT" | "RIGHT") {
    if (!ptzEntityId) {
      return;
    }

    return makeServiceCall("onvif", "ptz", {
      pan: direction,
      move_mode: "ContinuousMove",
      entity_id: ptzEntityId,
    });
  }

  function tilt(direction: "UP" | "DOWN") {
    if (!ptzEntityId) {
      return;
    }

    return makeServiceCall("onvif", "ptz", {
      tilt: direction,
      move_mode: "ContinuousMove",
      entity_id: ptzEntityId,
    });
  }

  useEffect(() => {
    if (!entityPicture) {
      setSnapshot(undefined);
      return;
    }

    let timeout = 0;

    async function updateImage() {
      const url = `${hassUrl}${entityPicture}&counter=${Date.now()}`;

      const success = await new Promise<boolean>((resolve) => {
        const image = new Image();

        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);

        image.src = url;
      });

      setSnapshot(success ? url : undefined);
      timeout = window.setTimeout(updateImage, 5000);
    }

    updateImage();

    return () => {
      window.clearTimeout(timeout);
    };
  }, [entityPicture]);

  return (
    <Wrapper>
      {snapshot ? (
        stream ? (
          <CameraStream entityId={entityId} />
        ) : (
          <img alt="" src={snapshot} />
        )
      ) : (
        <Overlay>Câmera Indisponível</Overlay>
      )}
      {snapshot && ptzEntityId && (
        <Buttons wrap>
          <PillButton icon="arrow-left" onClick={pan("LEFT")} />
          <PillButton icon="arrow-down" onClick={tilt("DOWN")} />
          <PillButton icon="arrow-up" onClick={tilt("UP")} />
          <PillButton icon="arrow-right" onClick={pan("RIGHT")} />
        </Buttons>
      )}
    </Wrapper>
  );
}
