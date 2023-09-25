import { useEffect } from "react";
import { GlobalStyles, CssBaseline, CssVarsProvider } from "@mui/joy";
import { HassProvider } from "./utils/hass";
import {
  autoUpdater,
  isTouchDevice,
  ResponsiveProvider,
} from "./utils/general";
import theme from "./theme";
import App from "./App";
import "./styles.css";

const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      body: {
        backgroundSize: "cover",
        fontFamily: "Raleway",
        color: "white",
        [theme.breakpoints.down("md")]: {
          backgroundImage: `url(${theme.wallpaper.mobile})`,
        },
        [theme.breakpoints.up("md")]: {
          backgroundImage: `url(${theme.wallpaper.desktop})`,
        },
      },
    })}
  />
);

export default function Main() {
  useEffect(() => {
    autoUpdater();

    window.location.hash = "";
    document.addEventListener("resume", autoUpdater);
    window.addEventListener("focus", autoUpdater);

    if (isTouchDevice) {
      window.oncontextmenu = () => false;
      document.body.classList.add("touch-device");
    }

    return () => {
      document.removeEventListener("resume", autoUpdater);
      window.removeEventListener("focus", autoUpdater);
    };
  }, []);

  return (
    <CssVarsProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      {globalStyles}
      <ResponsiveProvider>
        <HassProvider>
          <App />
        </HassProvider>
      </ResponsiveProvider>
    </CssVarsProvider>
  );
}
