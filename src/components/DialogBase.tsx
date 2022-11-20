import { ComponentChildren } from "preact";
import { JSXInternal } from "preact/src/jsx";
import Button from "./Button";
import Icon from "./Icon";
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
        <div class="component__dialog-base-header">
          {title}
          <Button onTap={onClose}>
            <Icon icon="close" />
          </Button>
        </div>
        <div class="component__dialog-base__content">{children}</div>
      </div>
    </div>
  );
}
