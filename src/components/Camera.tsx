import { useEffect, useState } from "react";
import { styled, css } from "../styling";
import { hassUrl, useEntity } from "../utils/hass";
import Paper from "./Paper";
import FullScreenCamera from "./FullScreenCamera";
import TouchButton from "./TouchButton";
import useModal from "../utils/useModal";

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
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: background 70ms linear;
  `
);

const SnapshotButton = styled(
  TouchButton,
  css`
    border: none;
    padding: 0;
    background: transparent;
  `
);

export default function Camera({
  aspectRatio,
  entityId,
  onMove,
}: {
  aspectRatio: number;
  entityId: string;
  onMove?: (direction: "LEFT" | "RIGHT" | "UP" | "DOWN") => void;
}) {
  const entity = useEntity(entityId);
  const [mount, modals] = useModal();
  const entityPicture = entity?.attributes?.entity_picture;
  const [snapshot, setSnapshot] = useState<string>();
  const isStreaming = modals.length < 0;

  useEffect(() => {
    if (isStreaming) {
      return;
    }

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

      timeout = window.setTimeout(updateImage, 10_000);
    }

    updateImage();

    return () => {
      window.clearTimeout(timeout);
    };
  }, [entityPicture, isStreaming]);

  function showStream() {
    mount((unmount) => (
      <FullScreenCamera
        aspectRatio={aspectRatio}
        entityId={entityId}
        onMove={onMove}
        onClose={unmount}
      />
    ));
  }

  const aspectRatioStyle = { aspectRatio: aspectRatio.toString() };

  return (
    <Wrapper>
      {modals}
      {snapshot ? (
        <SnapshotButton style={aspectRatioStyle} onDoubleTap={showStream}>
          <img alt="" src={snapshot} />
        </SnapshotButton>
      ) : (
        <Overlay style={aspectRatioStyle}>Câmera Indisponível</Overlay>
      )}
    </Wrapper>
  );
}
