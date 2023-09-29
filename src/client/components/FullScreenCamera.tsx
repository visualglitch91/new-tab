import { styled } from "@mui/joy";
import CameraStream from "./CameraStream";
import FlexRow from "./FlexRow";
import PillButton from "./PillButton";
import DialogBase from "./DialogBase";

const ButtonsWrapper = styled(FlexRow)({
  padding: "8px 0",
});

const Wrapper = styled("div")({
  width: "70vw",
  maxWidth: 960,
  lineHeight: 0,
});

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
  return (
    <DialogBase title="Câmera" onClose={onClose}>
      <Wrapper>
        <CameraStream aspectRatio={aspectRatio} entityId={entityId} />
      </Wrapper>
      {onMove && (
        <ButtonsWrapper wrap>
          <PillButton icon="arrow-left" onClick={() => onMove("LEFT")} />
          <PillButton icon="arrow-down" onClick={() => onMove("DOWN")} />
          <PillButton icon="arrow-up" onClick={() => onMove("UP")} />
          <PillButton icon="arrow-right" onClick={() => onMove("RIGHT")} />
        </ButtonsWrapper>
      )}
    </DialogBase>
  );
}
