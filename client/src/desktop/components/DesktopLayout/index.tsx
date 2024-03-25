import { useLocation } from "wouter";
import ClockAndWeather from "$client/components/ClockAndWeather";
import Pomodoro from "$client/components/Pomodoro";
import { useIsAdmin } from "$client/utils/hass";
import Tab from "./Tab";
import { Wrapper, Tabs, Content } from "./components";

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
