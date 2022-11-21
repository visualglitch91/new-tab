import Button from "./Button";
import Icon from "./Icon";
import "./DialogBase.css";

export default function DialogBase({
  title,
  children,
  onClose,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  function onOverlayClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (
      (e.target as HTMLElement)?.className === "component__dialog-base__wrapper"
    ) {
      onClose();
    }
  }

  return (
    <div className="component__dialog-base__wrapper" onClick={onOverlayClick}>
      <div className="component__dialog-base">
        <div className="component__dialog-base-header">
          {title}
          <Button onTap={onClose}>
            <Icon icon="close" />
          </Button>
        </div>
        <div className="component__dialog-base__content">{children}</div>
      </div>
    </div>
  );
}
