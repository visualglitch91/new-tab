import { styled, useScrollTrigger } from "@mui/material";
import { useBreakpoint } from "$app/utils/general";
import AltIconButton from "$app/components/AltIconButton";

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
    transition: "opacity 300ms var(--tween)",
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(28, 34, 48, 0.3)",
  },
  '&[data-elevate="true"]:after': { opacity: 1 },
  '&[data-mobile-external-display="true"]': {
    position: "static",
    "&:after": { display: "none" },
  },
});

const Ghost = styled("div")({
  opacity: 0,
  pointerEvents: "none",
  width: "100%",
  overflow: "hidden",
});

const Root = styled("div")({
  zIndex: 2,
  position: "relative",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const Buttons = styled("div")({
  position: "absolute",
  width: "100%",
  display: "flex",
  padding: "16px 16px 8px",
  gap: 6,
  zIndex: 3,
});

const ButtonsGhost = styled("div")({
  height: 40,
  transition: "height 200ms var(--tween)",
  '[data-shrink="true"] &': { height: 0 },
});

export interface PageHeaderProps {
  items?: React.ReactNode;
  children: React.ReactNode;
  shrinking?: "auto" | "disable" | "force";
}

export default function PageHeader({
  items,
  children,
  shrinking = "auto",
}: PageHeaderProps) {
  const { isMobileExternalDisplay } = useBreakpoint();
  const disableShrinking = shrinking === "disable";
  const forceShrinking = shrinking === "force";

  const elevate = useScrollTrigger({
    disableHysteresis: true,
    threshold: 20,
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
        <AltIconButton
          sx={{ marginRight: "auto" }}
          icon="menu"
          onClick={toggleAppDrawer}
        />
        {items}
      </Buttons>
      <ButtonsGhost />
      <Root>{children}</Root>
    </>
  );

  return (
    <>
      <ElevatedHeader
        data-mobile-external-display={isMobileExternalDisplay}
        data-elevate={forceShrinking || (!isMobileExternalDisplay && elevate)}
        data-shrink={
          forceShrinking ||
          isMobileExternalDisplay ||
          (!disableShrinking && shrink)
        }
      >
        {content}
      </ElevatedHeader>
      {!isMobileExternalDisplay && <Ghost>{content}</Ghost>}
    </>
  );
}
