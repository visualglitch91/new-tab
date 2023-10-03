import { useState } from "react";
import useMountEffect from "./useMountEffect";
import { DialogBaseControlProps } from "../components/DialogBase";

type Renderer = (
  unmount: () => void,
  dialogProps: DialogBaseControlProps
) => React.ReactNode;

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
    const unmount = () => unmountByKey(key);

    let onClose: () => void;
    let canClose = false;

    function Modal() {
      const [open, setOpen] = useState(false);

      onClose = () => {
        if (canClose) {
          setOpen(false);
        }
      };

      useMountEffect(() => {
        setOpen(true);
        setTimeout(() => {
          canClose = true;
        }, 500);
      });

      return (
        <>
          {renderer(unmount, {
            open,
            onClose,
            TransitionProps: { onExited: unmount },
          })}
        </>
      );
    }

    setModals((prev) => {
      return {
        ...prev,
        [key]: <Modal key={key} />,
      };
    });

    return () => {
      onClose?.();
    };
  }

  return [mount, Object.values(modals)] as [
    (renderer: Renderer) => () => void,
    React.ReactNode[]
  ];
}
