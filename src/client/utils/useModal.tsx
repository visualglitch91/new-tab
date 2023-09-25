import { Fragment, useState } from "react";
import { createPortal } from "react-dom";

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

    function requestCloseModal() {
      unmountByKey(key);
    }

    document.body.appendChild(container);

    setModals((prev) => {
      return {
        ...prev,
        [key]: (
          <Fragment key={key}>
            {createPortal(renderer(requestCloseModal), container)}
          </Fragment>
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
