import { ComponentChildren } from "preact";
import { JSXInternal } from "preact/src/jsx";
import Button from "./Button";
import "./DialogBase.css";

export default function DialogBase({
  title,
  children,
  onClose,
}: {
  title: ComponentChildren;
  children: ComponentChildren;
  onClose: () => void;
}) {
  function onOverlayClick(e: JSXInternal.TargetedMouseEvent<HTMLDivElement>) {
    if (
      (e.target as HTMLElement)?.className === "component__dialog-base__wrapper"
    ) {
      onClose();
    }
  }

  return (
    <div class="component__dialog-base__wrapper" onClick={onOverlayClick}>
      <div class="component__dialog-base">
        <div class="component__dialog-base-header">{title}</div>
        {children}
        <div class="component__dialog-base-footer">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}
