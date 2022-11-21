import { useRef } from "react";
import Button from "../Button";
import Icon from "../Icon";
import { Wrapper, Root, Header, Content } from "./components";

export default function DialogBase({
  title,
  children,
  onClose,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const keepOpenRef = useRef(false);
  const keepOpenTimerRef = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  function preventUnwantedClose() {
    keepOpenRef.current = true;
    window.clearTimeout(keepOpenTimerRef.current);
    keepOpenTimerRef.current = window.setTimeout(() => {
      keepOpenRef.current = false;
    }, 10);
  }

  function onOverlayClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target === overlayRef.current && !keepOpenRef.current) {
      onClose();
    }
  }

  return (
    <Wrapper ref={overlayRef} onClick={onOverlayClick}>
      <Root
        onMouseDown={preventUnwantedClose}
        onTouchStart={preventUnwantedClose}
      >
        <Header>
          {title}
          <Button onTap={onClose}>
            <Icon icon="close" />
          </Button>
        </Header>
        <Content>{children}</Content>
      </Root>
    </Wrapper>
  );
}
