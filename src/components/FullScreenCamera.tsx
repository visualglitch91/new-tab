import { styled, css } from "../styling";
import CameraStream from "./CameraStream";
import FlexRow from "./FlexRow";
import PillButton from "./PillButton";
import { useResponsive } from "../utils/general";
import DialogBase from "./DialogBase";

const buttonsWrapper = css`
  padding: 8px 0;
`;

const MobileWrapper = styled(
  "div",
  css`
    position: fixed;
    top: 0;
    left: 100%;
    width: 100vh;
    height: 100vw;
    transform: rotate(90deg);
    transform-origin: top left;
    background: black;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 12px;
    row-gap: 8px;

    & .${buttonsWrapper} {
      background: #2f3b5240;
      border-radius: 4px;
      padding: 8px;
    }

    & canvas {
      max-height: calc(100vw - 80px);
      width: unset !important;
      margin: 0 auto;
    }
  `
);

export default function FullScreenCamera({
  entityId,
  aspectRatio,
  onMove,
  onClose,
}: {
  entityId: string;
  aspectRatio: number;
  onMove?: (direction: "LEFT" | "RIGHT" | "UP" | "DOWN") => void;
  onClose: () => void;
}) {
  const { isMobile } = useResponsive();
  const Wrapper = isMobile ? MobileWrapper : DialogBase;

  return (
    <Wrapper title="Câmera" onClose={onClose}>
      <CameraStream aspectRatio={aspectRatio} entityId={entityId} />
      {onMove && (
        <FlexRow wrap className={buttonsWrapper}>
          <PillButton icon="arrow-left" onClick={() => onMove("LEFT")} />
          <PillButton icon="arrow-down" onClick={() => onMove("DOWN")} />
          <PillButton icon="arrow-up" onClick={() => onMove("UP")} />
          <PillButton icon="arrow-right" onClick={() => onMove("RIGHT")} />
          {isMobile && <PillButton icon="close" onClick={onClose} />}
        </FlexRow>
      )}
    </Wrapper>
  );
}
