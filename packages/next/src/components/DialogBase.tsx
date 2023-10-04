import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@mui/material";
import { SxProps } from "../theme/utils";
import { useBreakpoint } from "../utils/general";
import DialogSlideTransition from "./DialogSlideTransition";
import { sxx } from "../utils/styling";

export type DialogBaseControlProps = Pick<
  DialogProps,
  "open" | "TransitionProps"
> & {
  onClose: () => void;
};

export interface DialogBaseProps
  extends DialogBaseControlProps,
    Omit<DialogProps, "title" | "onClose"> {
  sx?: SxProps;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  bottomMobileSheet?: boolean;
  dividers?: boolean;
}

export default function DialogBase({
  sx,
  title,
  children,
  footer,
  dividers,
  bottomMobileSheet,
  ...props
}: DialogBaseProps) {
  const { isMobile } = useBreakpoint();

  return (
    <Dialog
      TransitionComponent={
        bottomMobileSheet && isMobile ? DialogSlideTransition : undefined
      }
      sx={sxx(
        bottomMobileSheet &&
          ((theme) => ({
            [theme.breakpoints.down("sm")]: {
              top: "unset",
              bottom: 0,
              left: 0,
              "& .MuiDialogTitle-root, & .MuiDialogContent-root": {
                textAlign: "center",
              },
              "& .MuiDialog-paper": {
                borderRadius: "18px",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                margin: 0,
                padding: 0,
                width: "100%",
                minWidth: "unset",
                maxWidth: "unset",
              },
              ...(bottomMobileSheet
                ? {
                    "& .MuiDialogActions-root": {
                      flexDirection: "column",
                      alignItems: "stretch",
                    },
                  }
                : {}),
            },
          })),
        sx
      )}
      {...props}
    >
      {title && (
        <DialogTitle
          sx={
            children && !dividers
              ? {
                  mb: "-16px",
                  "& + .MuiDialogContent-root": { pt: "16px !important" },
                }
              : {}
          }
        >
          {title}
        </DialogTitle>
      )}
      {children && (
        <DialogContent dividers={dividers}>{children}</DialogContent>
      )}
      {footer && <DialogActions>{footer}</DialogActions>}
    </Dialog>
  );
}
