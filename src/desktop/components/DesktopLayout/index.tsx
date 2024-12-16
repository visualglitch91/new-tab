import { omit } from "lodash";
import { useLocation } from "wouter";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import ClockAndWeather from "$app/components/ClockAndWeather";
import { AppDrawer } from "$app/mobile/components/AppDrawer";
import PageLayout from "$app/mobile/components/PageLayout";
import { Tabs, Content } from "./components";
import Tab from "./Tab";

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
    <Container sx={{ display: "flex", maxWidth: 1900 }} maxWidth={false}>
      <div>
        <Tabs>
          <ClockAndWeather
            compact
            sx={(theme) => ({
              background: theme.palette.white.main,
              color: theme.palette.white.contrastText,
            })}
          />
          {pages.map((page) => (
            <Tab
              key={page.path}
              active={location.startsWith(page.path)}
              {...omit(page, "component")}
            />
          ))}
        </Tabs>
      </div>
      <Content ref={contentRef}>{children}</Content>
    </Container>
  );
}
