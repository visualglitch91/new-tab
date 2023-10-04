import { Stack, styled } from "@mui/material";
import { SxProps } from "../../theme/utils";
import DialogBase, { DialogBaseControlProps } from "../DialogBase";
import useShellOutput from "./useShellOutput";
import AltIconButton from "../AltIconButton";
import Icon from "../Icon";

interface Size {
  width: number;
  height: number;
}

const fullscreenSx: SxProps = {
  "& .MuiDialog-paper": {
    margin: 0,
    width: "100vw",
    height: "100vh",
    maxWidth: "unset",
    maxHeight: "unset",
    borderRadius: 0,
  },
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

const Content = styled("div")(({ theme }) => ({
  height: "100%",
  [theme.breakpoints.down("sm")]: { px: 0, pb: 0 },
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

export default function ShellOutputDialog({
  title,
  size,
  processId,
  ...props
}: {
  title: string;
  size?: { width: number; height: number };
  processId: string;
} & DialogBaseControlProps) {
  const { shellOutput } = useShellOutput(processId);

  return (
    <DialogBase
      {...props}
      bottomMobileSheet
      sx={size ? windowedSx(size) : fullscreenSx}
      title={
        <Stack direction="row" justifyContent="space-between">
          <span>{title}</span>
          <AltIconButton size="small" onClick={props.onClose}>
            <Icon icon="close" size={16} />
          </AltIconButton>
        </Stack>
      }
    >
      <Content>{shellOutput}</Content>
    </DialogBase>
  );
}
