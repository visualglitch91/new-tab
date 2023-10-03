import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";

export type DialogBaseControlProps = Pick<
  DialogProps,
  "open" | "onClose" | "TransitionProps"
>;

export interface DialogBaseProps extends DialogBaseControlProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function DialogBase({
  title,
  children,
  footer,
  ...props
}: DialogBaseProps) {
  return (
    <Dialog {...props}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {children && <DialogContent>{children}</DialogContent>}
      {footer && <DialogActions>{footer}</DialogActions>}
    </Dialog>
  );
}
