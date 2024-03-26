import { Route, useLocation } from "wouter";
import CssBaseline from "@mui/material/CssBaseline";
import { GlobalStyles, ThemeProvider } from "@mui/material";
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

export default function App() {
  const [location, navigate] = useLocation();

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
      <GlobalStyles
        styles={(theme) => ({
          "body *": { fontFamily: theme.typography.fontFamily },
        })}
      />
      <BreakpointProvider
        onChange={({ isMobile }) => {
          const basePath = isMobile ? "/mobile" : "/desktop";

          if (!location.startsWith(basePath)) {
            navigate(basePath);
          }
        }}
      >
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <HassProvider>
            <SocketIOProvider>
              <ModalProvider>
                <Route path="/mobile/*?">
                  <Mobile />
                </Route>
                <Route path="/desktop/*?">
                  <Desktop />
                </Route>
              </ModalProvider>
            </SocketIOProvider>
          </HassProvider>
        </QueryClientProvider>
      </BreakpointProvider>
    </ThemeProvider>
  );
}
