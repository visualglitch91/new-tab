import { useTheme } from "@mui/material";
import { Breakpoint } from "@mui/system";
import { useEffect, useState } from "react";

export function useCurrentBreakpoint(): Breakpoint {
  const globalTheme = useTheme();

  const mqs: [Breakpoint, string][] = globalTheme.breakpoints.keys.map(
    (key, index, breakpoints) => {
      let mq = "";
      if (index === breakpoints.length - 1) {
        mq = globalTheme.breakpoints.up(key);
      } else {
        mq = globalTheme.breakpoints.between(key, breakpoints[index + 1]);
      }
      return [key, mq.replace(/^@media( ?)/m, "")];
    }
  );

  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(() => {
    const bp = mqs.find(([, mq]) => window.matchMedia(mq).matches);
    return bp ? bp[0] : "xs";
  });

  useEffect(() => {
    const handleCurrentBreakpointChange = (
      key: Breakpoint,
      e: MediaQueryListEvent
    ) => {
      if (e.matches) {
        setCurrentBreakpoint(key);
      }
    };

    const handlers: [string, (e: MediaQueryListEvent) => void][] = mqs.map(
      ([key, mq]) => {
        const handler = (e: MediaQueryListEvent) =>
          handleCurrentBreakpointChange(key, e);
        return [mq, handler];
      }
    );

    handlers.forEach(([mq, handler]) => {
      window.matchMedia(mq).addEventListener("change", handler);
    });

    return () => {
      handlers.forEach(([mq, handler]) => {
        window.matchMedia(mq).removeEventListener("change", handler);
      });
    };
  }, [mqs]);

  return currentBreakpoint;
}
