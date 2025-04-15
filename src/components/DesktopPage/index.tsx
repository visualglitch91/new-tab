import { useState } from "react";
import { styled } from "@mui/material";
import { PaletteColors } from "$app/theme/palette";
import { usePageColor } from "$app/atoms/pageColor";
import useMountEffect from "$app/utils/useMountEffect";
import { scrollbarWidth } from "$app/utils/styling";
import Banner from "./Banner";

const animationDuration = 500;

const Root = styled("div")<{ color: PaletteColors; mounted?: boolean }>(
  ({ theme, color, mounted }) => ({
    display: "flex",
    width: "100%",
    height: "100%",
    borderRight: `2px solid ${theme.palette[color].main}`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? "none" : "translateX(-70%)",
    transition: `all ${animationDuration}ms cubic-bezier(0.1, 0.7, 0.3, 1)`,
  })
);

const Content = styled("div")<{ entered?: boolean }>(({ theme, entered }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  padding: theme.spacing(3, 4),
  overflowY: entered ? "auto" : "hidden",
  paddingRight: entered
    ? theme.spacing(4)
    : `calc(${theme.spacing(4)} + ${scrollbarWidth}px)`,
  overflowX: "hidden",
}));

export default function DesktopPage({
  color,
  label,
  banner,
  component: Component,
}: {
  color: PaletteColors;
  label: string;
  banner: string;
  component: React.ComponentType;
}) {
  const [, setPageColor] = usePageColor();
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useMountEffect(() => {
    const timeout = setTimeout(() => setEntered(true), animationDuration);

    setPageColor(color);
    setMounted(true);

    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <Root color={color} mounted={mounted}>
      <Banner src={banner} label={label} color={color} />
      <Content entered={entered}>
        <Component />
      </Content>
    </Root>
  );
}
