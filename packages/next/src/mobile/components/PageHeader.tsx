import { styled, useScrollTrigger } from "@mui/material";
import Icon from "../../components/Icon";
import AltIconButton from "../../components/AltIconButton";

const ElevatedHeader = styled("div")({
  position: "sticky",
  top: 0,
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

const Root = styled("div")({
  zIndex: 2,
  position: "relative",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  transition: "align-items 100ms linear",
  '[data-elevate="true"] &': {
    alignItems: "center",
  },
});

const Buttons = styled("div")({
  width: "100%",
  position: "relative",
  display: "flex",
  padding: "16px 16px 0",
  gap: 6,
  zIndex: 3,
  '[data-elevate="true"] &': {
    position: "absolute",
  },
});

export default function PageHeader({
  items,
  children,
}: {
  items?: React.ReactNode;
  children: React.ReactNode;
}) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  function toggleAppDrawer() {
    window.dispatchEvent(new Event("toggle-app-drawer"));
  }

  return (
    <ElevatedHeader data-elevate={trigger}>
      <Buttons>
        <AltIconButton sx={{ marginRight: "auto" }} onClick={toggleAppDrawer}>
          <Icon icon="menu" size={20} />
        </AltIconButton>
        {items}
      </Buttons>
      <Root>{children}</Root>
    </ElevatedHeader>
  );
}
