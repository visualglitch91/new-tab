import { SxProps } from "@mui/joy/styles/types";
import DialogBase from "../DialogBase";
import useShellOutput from "./useShellOutput";

interface Size {
  width: number;
  height: number;
}

const fullscreenSx: SxProps = {
  width: "100vw",
  height: "100vh",
  maxWidth: "unset",
  maxHeight: "unset",
  borderRadius: 0,
};

const windowedSx =
  (size: Size): SxProps =>
  (theme) => ({
    width: "90vw",
    height: "90vh",
    maxWidth: `${size.width}px`,
    maxHeight: `${size.height}px`,
    [theme.breakpoints.down("sm")]: fullscreenSx,
  });

export default function ShellOutputDialog({
  title,
  size,
  processId,
  onClose,
}: {
  title: string;
  size?: { width: number; height: number };
  processId: string;
  onClose: () => void;
}) {
  const { shellOutput } = useShellOutput(processId);

  return (
    <DialogBase
      sx={size ? windowedSx(size) : fullscreenSx}
      contentSx={(theme) => ({
        height: "100%",
        [theme.breakpoints.down("sm")]: { px: 0, pb: 0 },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      })}
      title={title}
      closeButtonOnMobile
      onClose={onClose}
    >
      {shellOutput}
    </DialogBase>
  );
}
