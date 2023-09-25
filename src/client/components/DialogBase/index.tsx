import { createContext, useContext, useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import Modal from "@mui/joy/Modal";
// import BaseDiv from "../BaseDiv";
import {
  DialogContent,
  DialogTitle,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { useResponsive } from "../../utils/general";
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
  title,
  children,
  onClose,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const {
    open,
    duration: _duration,
    onExited,
  } = useContext(DialogHelperContext) || fallbackContext;

  const { isMobile } = useResponsive();
  const duration = isMobile ? _duration * 2 : _duration;

  useEffect(() => {
    if (open) {
      setTimeout(setInternalOpen, 10, true);
    } else {
      setInternalOpen(false);
    }
  }, [open]);

  return (
    <Transition in={internalOpen} timeout={duration} onExited={onExited}>
      {(state: string) => (
        <Modal
          keepMounted
          open={!["exited", "exiting"].includes(state)}
          onClose={onClose}
          slotProps={{
            backdrop: {
              sx: {
                opacity: 0,
                backdropFilter: "none",
                transition: `opacity ${duration}ms, backdrop-filter ${duration}ms`,
                transitionTimingFunction,
                ...{
                  entering: { opacity: 1, backdropFilter: "blur(8px)" },
                  entered: { opacity: 1, backdropFilter: "blur(8px)" },
                }[state],
              },
            },
          }}
          sx={{ visibility: state === "exited" ? "hidden" : "visible" }}
        >
          <ModalDialog
            variant="plain"
            sx={(theme) => ({
              boxShadow: theme.shadow.xs,
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
            })}
          >
            {title && (
              <DialogTitle>
                <Typography>{title}</Typography>
              </DialogTitle>
            )}
            {!isMobile && <ModalClose />}
            <BaseDiv
              sx={{
                margin: "calc(var(--Card-padding) * -1)",
                padding: "var(--Card-padding)",
              }}
            >
              {children}
            </BaseDiv>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
}
