import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { SxProps } from "../theme/utils";

export type DialogBaseControlProps = Pick<
  DialogProps,
  "open" | "onClose" | "TransitionProps"
>;

export interface DialogBaseProps extends DialogBaseControlProps {
  sx?: SxProps;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function DialogBase({
  sx,
  title,
  children,
  footer,
  ...props
}: DialogBaseProps) {
  return (
    <Dialog {...props} sx={sx}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {children && <DialogContent>{children}</DialogContent>}
      {footer && <DialogActions>{footer}</DialogActions>}
    </Dialog>
  );
}
