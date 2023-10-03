import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./utils/queryClient";
import { HassProvider } from "./utils/hass";
import { SocketIOProvider } from "./utils/api";
import { removeParamsFromUrl } from "./utils/url";
import useMountEffect from "./utils/useMountEffect";
import theme from "./theme";
import Mobile from "./mobile";

export default function MyApp() {
  useMountEffect(() => {
    removeParamsFromUrl(["reload"]);
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <HassProvider>
          <SocketIOProvider>
            <Mobile />
          </SocketIOProvider>
        </HassProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
