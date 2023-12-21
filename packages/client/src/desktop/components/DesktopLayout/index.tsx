import { useLocation } from "wouter";
import Tab from "./Tab";
import { Wrapper, Tabs, Content } from "./components";
import ClockAndWeather from "../../../components/ClockAndWeather";
import Pomodoro from "../../../components/Pomodoro";

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
          <Pomodoro sx={{ marginBottom: "16px" }} />
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
