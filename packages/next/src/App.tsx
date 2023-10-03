import { useEffect } from "react";
import { useLocation } from "wouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./utils/queryClient";
import { HassProvider } from "./utils/hass";
import { SocketIOProvider } from "./utils/api";
import { removeParamsFromUrl } from "./utils/url";
import { isTouchDevice } from "./utils/general";
import clock from "./utils/clock";
import useMountEffect from "./utils/useMountEffect";
import theme from "./theme";
import Mobile from "./mobile";

export default function MyApp() {
  const [, navigate] = useLocation();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    navigate(mobile ? "/mobile" : "/desktop");
    //eslint-disable-next-line
  }, [mobile]);

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
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <HassProvider>
          <SocketIOProvider>
            <ConfirmProvider>
              <Mobile />
            </ConfirmProvider>
          </SocketIOProvider>
        </HassProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
