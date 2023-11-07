import { createContext, useContext, useEffect, useMemo } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { getSearchParam } from "./url";

export const mode = getSearchParam("mode");

export const isNewTab = mode === "new-tab";

export const isAndroidLauncher = mode === "android-launcher";

export const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  //@ts-expect-error Bad browser typings
  navigator.msMaxTouchPoints > 0;

export function formatNumericValue(
  value: string | number,
  suffix: string,
  decimalPlaces = 1
) {
  const decimalPlacesFactor = decimalPlaces > 0 ? decimalPlaces * 10 : 1;

  const formatted = (
    Math.round(Number(value) * decimalPlacesFactor) / decimalPlacesFactor
  ).toFixed(decimalPlaces);

  return `${formatted}${suffix}`;
}

const BreakpointContext = createContext<
  | {
      isMobile: boolean;
      isDesktop: boolean;
      isMobileExternalDisplay: boolean;
    }
  | undefined
>(undefined);

export function BreakpointProvider({
  onChange,
  children,
}: {
  onChange: (value: {
    isMobile: boolean;
    isDesktop: boolean;
    isMobileExternalDisplay: boolean;
  }) => void;
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobileExternalDisplay = useMediaQuery("@media(max-height: 528px)");

  const value = useMemo(() => {
    return { isMobile: mobile, isDesktop: !mobile, isMobileExternalDisplay };
  }, [mobile, isMobileExternalDisplay]);

  useEffect(() => {
    onChange(value);
    //eslint-disable-next-line
  }, [value]);

  return (
    <BreakpointContext.Provider value={value}>
      {children}
    </BreakpointContext.Provider>
  );
}

export function useBreakpoint() {
  const result = useContext(BreakpointContext);

  if (!result) {
    throw new Error("Must be called inside a ResponsiveProvider");
  }

  return result;
}

export function formatDate(date: string | Date) {
  return new Date(date)
    .toLocaleDateString("pt-BR", {
      month: "short",
      day: "numeric",
    })
    .replaceAll(".", "");
}

export function clearReactQueryCacheAndReload() {
  if (!!window.localStorage.getItem("REACT_QUERY_OFFLINE_CACHE")) {
    window.localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
  }

  window.location.reload();
}
