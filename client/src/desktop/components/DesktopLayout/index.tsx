import { useLocation } from "wouter";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import ClockAndWeather from "$client/components/ClockAndWeather";
import { AppDrawer } from "$client/mobile/components/AppDrawer";
import Pomodoro from "$client/components/Pomodoro";
import { useIsAdmin } from "$client/utils/hass";
import Tab from "./Tab";
import { Wrapper, Tabs, Content } from "./components";
import PageLayout from "$client/mobile/components/PageLayout";

interface PageConfig {
  path: string;
  icon: string;
  label: string;
  component: React.ReactNode;
}

export default function DesktopLayout({
  pages,
  children,
  contentRef,
}: {
  pages: PageConfig[];
  children?: React.ReactNode;
  contentRef?: React.RefObject<HTMLDivElement>;
}) {
  const [location] = useLocation();
  const isAdmin = useIsAdmin();
  const theme = useTheme();
  const tablet = useMediaQuery(theme.breakpoints.down("md"));

  if (tablet) {
    return (
      <PageLayout header={<Box height={32} />} sx={{ p: 0, mt: -7 }}>
        <AppDrawer pages={pages} />
        <Content ref={contentRef}>{children}</Content>
      </PageLayout>
    );
  }

  return (
    <Wrapper>
      <div>
        <Tabs>
          <ClockAndWeather
            compact
            sx={(theme) => ({
              background: theme.palette.white.main,
              color: theme.palette.white.contrastText,
            })}
          />
          {isAdmin && <Pomodoro sx={{ marginBottom: "16px" }} />}
          {pages.map(({ component, ...page }) => (
            <Tab
              key={page.path}
              active={location.startsWith(page.path)}
              {...page}
            />
          ))}
        </Tabs>
      </div>
      <Content ref={contentRef}>{children}</Content>
    </Wrapper>
  );
}
