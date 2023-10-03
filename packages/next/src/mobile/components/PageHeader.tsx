import { styled, useScrollTrigger } from "@mui/material";
import Icon from "../../components/Icon";
import AltIconButton from "../../components/AltIconButton";

const ElevatedHeader = styled("div")({
  position: "fixed",
  top: 0,
  width: "100%",
  zIndex: 10,
  "&:after": {
    zIndex: 1,
    content: '" "',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    transition: "opacity 170ms linear",
    backdropFilter: "blur(10px)",
    background: "",
    backgroundImage: `linear-gradient(
      to top,
      rgba(200,200,200, 0.2) 0%,
      rgba(200,200,200, 0.1) 34%,
      #242e42 100%
    )`,
  },
  '&[data-elevate="true"]:after': { opacity: 1 },
});

const Ghost = styled("div")({
  opacity: 0,
  pointerEvents: "none",
});

const Root = styled("div")({
  zIndex: 2,
  position: "relative",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  "& > span": {
    transition: "transform 200ms var(--tween)",
    position: "relative",
  },
  '[data-shrink="true"] & > span': {
    transform: "translateX(48px)",
  },
});

const Buttons = styled("div")({
  position: "absolute",
  width: "100%",
  display: "flex",
  padding: "16px 16px 0",
  gap: 6,
  zIndex: 3,
});

const ButtonsGhost = styled("div")({
  height: 32,
  transition: "height 200ms var(--tween)",
  '[data-shrink="true"] &': {
    height: 0,
  },
});

export default function PageHeader({
  items,
  children,
}: {
  items?: React.ReactNode;
  children: React.ReactNode;
}) {
  const elevate = useScrollTrigger({
    disableHysteresis: true,
    threshold: 30,
  });

  const shrink = useScrollTrigger({
    disableHysteresis: true,
    threshold: 140,
  });

  function toggleAppDrawer() {
    window.dispatchEvent(new Event("toggle-app-drawer"));
  }

  const content = (
    <>
      <Buttons>
        <AltIconButton sx={{ marginRight: "auto" }} onClick={toggleAppDrawer}>
          <Icon icon="menu" size={20} />
        </AltIconButton>
        {items}
      </Buttons>
      <ButtonsGhost />
      <Root>
        <span>{children}</span>
      </Root>
    </>
  );

  return (
    <>
      <ElevatedHeader data-elevate={elevate} data-shrink={shrink}>
        {content}
      </ElevatedHeader>
      <Ghost>{content}</Ghost>
    </>
  );
}
