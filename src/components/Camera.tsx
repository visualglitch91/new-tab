import { useEffect, useState } from "react";
import { styled, css } from "../styling";
import { hassUrl, useEntity } from "../utils/hass";
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
  onMove,
}: {
  stream: boolean;
  entityId: string;
  onMove?: (direction: "LEFT" | "RIGHT" | "UP" | "DOWN") => void;
}) {
  const entity = useEntity(entityId);
  const entityPicture = entity?.attributes?.entity_picture;
  const [snapshot, setSnapshot] = useState<string>();

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
      {snapshot && onMove && (
        <Buttons wrap>
          <PillButton icon="arrow-left" onClick={() => onMove("LEFT")} />
          <PillButton icon="arrow-down" onClick={() => onMove("DOWN")} />
          <PillButton icon="arrow-up" onClick={() => onMove("UP")} />
          <PillButton icon="arrow-right" onClick={() => onMove("RIGHT")} />
        </Buttons>
      )}
    </Wrapper>
  );
}
