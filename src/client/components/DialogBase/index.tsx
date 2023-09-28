import { createContext, useContext, useEffect, useState } from "react";
import {
  Modal,
  Typography,
  ModalClose,
  DialogTitle,
  ModalDialog,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { Transition } from "react-transition-group";
import { useResponsive } from "../../utils/general";
import { alpha, sxx } from "../../utils/styles";
import BaseDiv from "../BaseDiv";

const DialogHelperContext = createContext<{
  open: boolean;
  duration: number;
  onExited: () => void;
} | null>(null);

const fallbackContext = {
  open: true,
  duration: 0,
  onExited: () => {},
};

const transitionTimingFunction = "cubic-bezier(0.76, 0, 0.24, 1)";

export function DialogBaseProvider({
  children,
  ...state
}: {
  open: boolean;
  children: React.ReactNode;
  onExited: () => void;
}) {
  return (
    <DialogHelperContext.Provider value={{ ...state, duration: 180 }}>
      {children}
    </DialogHelperContext.Provider>
  );
}

export default function DialogBase({
  sx,
  contentSx,
  title,
  children,
  closeButtonOnMobile,
  onClose,
}: {
  sx?: SxProps;
  contentSx?: SxProps;
  title?: React.ReactNode;
  children: React.ReactNode;
  closeButtonOnMobile?: boolean;
  onClose: () => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const {
    open,
    duration: _duration,
    onExited,
  } = useContext(DialogHelperContext) || fallbackContext;

  const { isDesktop } = useResponsive();
  const duration = isDesktop ? _duration : _duration * 2;

  useEffect(() => {
    if (open) {
      setTimeout(setInternalOpen, 10, true);
    } else {
      setInternalOpen(false);
    }
  }, [open]);

  return (
    <Transition in={internalOpen} timeout={duration} onExited={onExited}>
      {(state: string) => {
        const isOpen = !["exited", "exiting"].includes(state);

        return (
          <Modal
            keepMounted
            open={isOpen}
            onClose={state === "entered" ? onClose : undefined}
            slotProps={{
              backdrop: {
                sx: (theme) => ({
                  opacity: 0,
                  backdropFilter: "none",
                  background: alpha(theme.palette.background.body, 0.6),
                  transition: `opacity ${duration}`,
                  willChange: "opacity",
                  transitionTimingFunction,
                  ...{
                    entering: { opacity: 1 },
                    entered: { opacity: 1 },
                  }[state],
                }),
              },
            }}
            sx={{ visibility: state === "exited" ? "hidden" : "visible" }}
          >
            <ModalDialog
              variant="plain"
              sx={sxx(
                (theme) => ({
                  padding: 0,
                  boxShadow: theme.shadow.xs,
                  gap: 0,
                  transitionTimingFunction,
                  [theme.breakpoints.down("sm")]: {
                    top: "unset",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    maxWidth: "unset",
                    transform: "translate3d(0, 100%, 0)",
                    transition: `transform ${duration}ms`,
                    willChange: "transform",
                    ...{
                      entering: { transform: "translate3d(0, 0, 0)" },
                      entered: { transform: "translate3d(0, 0, 0)" },
                    }[state],
                  },
                  [theme.breakpoints.up("sm")]: {
                    opacity: 0,
                    transition: `opacity ${duration}ms`,
                    ...{
                      entering: { opacity: 1 },
                      entered: { opacity: 1 },
                    }[state],
                  },
                }),
                sx
              )}
            >
              {title && (
                <DialogTitle
                  sx={{ padding: "var(--Card-padding)", paddingBottom: 0 }}
                >
                  <Typography>{title}</Typography>
                </DialogTitle>
              )}
              {(isDesktop || closeButtonOnMobile) && <ModalClose />}
              <BaseDiv sx={sxx({ padding: "var(--Card-padding)" }, contentSx)}>
                {children}
              </BaseDiv>
            </ModalDialog>
          </Modal>
        );
      }}
    </Transition>
  );
}
