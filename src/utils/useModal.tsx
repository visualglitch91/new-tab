import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "preact-transitioning";
import { useResponsive } from "./general";

type Renderer = (unmount: () => void) => React.ReactNode;

export default function useModal() {
  const [modals, setModals] = useState<Record<string, React.ReactNode>>({});

  function unmountByKey(key: string) {
    setModals((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function mount(renderer: Renderer) {
    const key = Date.now().toString();
    const container = document.createElement("div");

    let closeModal: () => void;
    let shouldUnmount = false;

    function requestCloseModal() {
      shouldUnmount = true;
      closeModal?.();
    }

    function Modal() {
      const [open, setOpen] = useState(false);
      const { isMobile } = useResponsive();
      const duration = isMobile ? 400 : 180;

      useEffect(() => {
        setOpen(true);
        closeModal = () => setOpen(false);
      }, []);

      return (
        <CSSTransition
          in={open}
          duration={duration}
          classNames="modal-transition"
          onExited={() => {
            if (shouldUnmount) {
              unmountByKey(key);
              container.remove();
            }
          }}
        >
          <div className="modal-transition">{renderer(requestCloseModal)}</div>
        </CSSTransition>
      );
    }

    document.body.appendChild(container);

    setModals((prev) => {
      return {
        ...prev,
        [key]: (
          <Fragment key={key}>{createPortal(<Modal />, container)}</Fragment>
        ),
      };
    });

    return requestCloseModal;
  }

  return [mount, Object.values(modals)] as [
    (renderer: Renderer) => () => void,
    React.ReactNode[]
  ];
}
