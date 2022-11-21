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
  function onOverlayClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (
      (e.target as HTMLElement)?.className === "component__dialog-base__wrapper"
    ) {
      onClose();
    }
  }

  return (
    <Wrapper onClick={onOverlayClick}>
      <Root>
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
