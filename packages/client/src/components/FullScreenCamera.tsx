import { Stack, styled } from "@mui/material";
import CameraStream from "./CameraStream";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
import Icon from "./Icon";
import AltIconButton from "./AltIconButton";

const Wrapper = styled("div")(({ theme }) => ({
  width: "70vw",
  maxWidth: 960,
  lineHeight: 0,
  [theme.breakpoints.down("sm")]: { width: "100%" },
}));

export default function FullScreenCamera({
  entityId,
  aspectRatio,
  onMove,
  ...props
}: {
  entityId: string;
  aspectRatio: number;
  onMove?: (direction: "LEFT" | "RIGHT" | "UP" | "DOWN") => void;
} & DialogBaseControlProps) {
  return (
    <DialogBase title="Câmera" {...props}>
      <Wrapper>
        <CameraStream aspectRatio={aspectRatio} entityId={entityId} />
      </Wrapper>
      {onMove && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ margin: "12px auto" }}
        >
          <AltIconButton color="primary" onClick={() => onMove("LEFT")}>
            <Icon icon="arrow-left" />
          </AltIconButton>
          <AltIconButton color="primary" onClick={() => onMove("DOWN")}>
            <Icon icon="arrow-down" />
          </AltIconButton>
          <AltIconButton color="primary" onClick={() => onMove("UP")}>
            <Icon icon="arrow-up" />
          </AltIconButton>
          <AltIconButton color="primary" onClick={() => onMove("RIGHT")}>
            <Icon icon="arrow-right" />
          </AltIconButton>
        </Stack>
      )}
    </DialogBase>
  );
}
