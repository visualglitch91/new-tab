import { useEffect, useState } from "react";
import { DialogBaseProvider } from "../components/DialogBase";

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

    let closeModal: () => void;
    let shouldUnmount = false;

    function requestCloseModal() {
      shouldUnmount = true;
      closeModal?.();
    }

    function Modal() {
      const [open, setOpen] = useState(false);

      useEffect(() => {
        setOpen(true);
        closeModal = () => setOpen(false);
      }, []);

      return (
        <DialogBaseProvider
          open={open}
          onExited={() => {
            if (shouldUnmount) {
              unmountByKey(key);
            }
          }}
        >
          {renderer(requestCloseModal)}
        </DialogBaseProvider>
      );
    }

    setModals((prev) => {
      return {
        ...prev,
        [key]: <Modal key={key} />,
      };
    });

    return requestCloseModal;
  }

  return [mount, Object.values(modals)] as [
    (renderer: Renderer) => () => void,
    React.ReactNode[]
  ];
}
