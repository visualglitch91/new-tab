import { useEffect } from "react";
import { styled } from "@mui/joy";
import { alpha } from "../utils/styles";
import { useResponsive } from "../utils/general";
import CameraStream from "./CameraStream";
import FlexRow from "./FlexRow";
import PillButton from "./PillButton";
import DialogBase from "./DialogBase";

const ButtonsWrapper = styled(FlexRow)({
  padding: "8px 0",
});

const MobileWrapper = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: "100%",
  width: "100vh",
  height: "100vw",
  transform: "rotate(90deg)",
  transformOrigin: "top left",
  background: "black",
  zIndex: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: "12px",
  rowGap: "8px",

  [`& .${ButtonsWrapper}`]: {
    background: alpha(theme.palette.background.body, 0.25),
    borderRadius: "4px",
    padding: "8px",
  },

  "& canvas": {
    maxHeight: "calc(100vw - 80px)",
    width: "unset !important",
    margin: "0 auto",
  },
}));

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

  useEffect(() => {
    if (isMobile) {
      document.body.requestFullscreen();

      return () => {
        document.exitFullscreen();
      };
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper title="Câmera" onClose={onClose}>
      <CameraStream aspectRatio={aspectRatio} entityId={entityId} />
      {onMove && (
        <ButtonsWrapper wrap>
          <PillButton icon="arrow-left" onClick={() => onMove("LEFT")} />
          <PillButton icon="arrow-down" onClick={() => onMove("DOWN")} />
          <PillButton icon="arrow-up" onClick={() => onMove("UP")} />
          <PillButton icon="arrow-right" onClick={() => onMove("RIGHT")} />
          {isMobile && <PillButton icon="close" onClick={onClose} />}
        </ButtonsWrapper>
      )}
    </Wrapper>
  );
}
