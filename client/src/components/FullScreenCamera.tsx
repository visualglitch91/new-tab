import { Stack, styled } from "@mui/material";
import CameraStream from "./CameraStream";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
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
          <AltIconButton
            icon="arrow-left"
            color="primary"
            onClick={() => onMove("LEFT")}
          />
          <AltIconButton
            icon="arrow-down"
            color="primary"
            onClick={() => onMove("DOWN")}
          />
          <AltIconButton
            icon="arrow-up"
            color="primary"
            onClick={() => onMove("UP")}
          />
          <AltIconButton
            icon="arrow-right"
            color="primary"
            onClick={() => onMove("RIGHT")}
          />
        </Stack>
      )}
    </DialogBase>
  );
}
