import { Link, useLocation } from "wouter";
import { styled, Tab, Tabs } from "@mui/material";
import { PaletteColors } from "$app/theme/palette";
import { usePageColor } from "$app/atoms/pageColor";
import routes from "$app/desktop/routes";

const Root = styled(Tabs)<{ color?: PaletteColors }>(({ theme, color }) => ({
  minHeight: 0,
  height: "calc(100% - 1px)",
  "& .MuiTabs-flexContainer, & .MuiTab-root": {
    minHeight: 0,
    height: "100%",
  },
  "& .MuiTab-root": {
    padding: theme.spacing(0, 1.5),
    fontSize: 13,
    minWidth: 0,
  },
  "& .MuiTab-root.Mui-selected": {
    color: theme.palette.text.secondary,
  },
  "& .MuiTabs-indicator": {
    height: "1px",
    backgroundColor: color ? theme.palette[color].main : undefined,
  },
}));

export default function Navigation() {
  const [pageColor] = usePageColor();
  const [location] = useLocation();
  const currentIndex = routes.findIndex((route) => route.path === location);

  return (
    <Root value={currentIndex} color={pageColor}>
      {routes.map((route, index) => (
        <Tab
          key={index}
          component={Link}
          label={route.label}
          href={route.path}
        />
      ))}
    </Root>
  );
}
