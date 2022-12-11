import { useRef, useState } from "react";
import { css } from "../../styling";
import Timer from "../../utils/Timer";
import Button from "../Button";
import Icon from "../Icon";
import { Wrapper, Root, Header, Content } from "./components";

const classes = {
  closeButton: css`
    margin-left: auto;
  `,
};

export default function DialogBase({
  title,
  children,
  onClose,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const [keepOpenTimer] = useState(() => {
    const timer = new Timer("timeout");
    timer.start(() => {}, 100);
    return timer;
  });

  function keepOpen() {
    keepOpenTimer.start(() => {}, 10);
  }

  function onOverlayClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target === overlayRef.current && !keepOpenTimer.isRunning()) {
      onClose();
    }
  }

  return (
    <Wrapper ref={overlayRef} onClick={onOverlayClick}>
      <Root onMouseDown={keepOpen} onTouchStart={keepOpen}>
        <Header>
          {title}
          <Button className={classes.closeButton} onTap={onClose}>
            <Icon icon="close" />
          </Button>
        </Header>
        <Content>{children}</Content>
      </Root>
    </Wrapper>
  );
}
