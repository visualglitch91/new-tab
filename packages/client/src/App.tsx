import { Route, Router, useLocation } from "wouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./utils/queryClient";
import { HassProvider } from "./utils/hass";
import { SocketIOProvider } from "./utils/api";
import { removeParamsFromUrl } from "./utils/url";
import { BreakpointProvider, isTouchDevice } from "./utils/general";
import { ModalProvider } from "./utils/useModal";
import clock from "./utils/clock";
import useMountEffect from "./utils/useMountEffect";
import theme from "./theme";
import Mobile from "./mobile";
import Desktop from "./desktop";

function BaseRoute({
  path,
  children,
}: {
  path: string;
  children?: React.ReactNode;
}) {
  return (
    <Route path={`${path}/:rest*`}>
      <Router base={path}>
        <Route path="/:rest*">{children}</Route>
      </Router>
    </Route>
  );
}

export default function MyApp() {
  const [location, navigate] = useLocation();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  function onBreakpointChange() {
    const basePath = mobile ? "/mobile" : "/desktop";

    if (!location.startsWith(basePath)) {
      navigate(basePath);
    }
  }

  useMountEffect(() => {
    if (isTouchDevice) {
      window.oncontextmenu = () => false;
    }

    clock.start();
    removeParamsFromUrl(["reload"]);
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BreakpointProvider onChange={onBreakpointChange}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <HassProvider>
            <SocketIOProvider>
              <ModalProvider>
                <BaseRoute path="/mobile">
                  <Mobile />
                </BaseRoute>
                <BaseRoute path="/desktop">
                  <Desktop />
                </BaseRoute>
              </ModalProvider>
            </SocketIOProvider>
          </HassProvider>
        </QueryClientProvider>
      </BreakpointProvider>
    </ThemeProvider>
  );
}
