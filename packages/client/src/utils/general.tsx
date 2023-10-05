import { createContext, useContext, useEffect, useMemo } from "react";
import { clearValue, loadValue, saveValue } from "./storage";
import { useMediaQuery, useTheme } from "@mui/material";

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

const performanceDataVersion = 8;

export function retryDevicePerformance() {
  clearValue("device-performance");
  window.location.reload();
}

export async function calculateDevicePerformance() {
  console.log("Getting performance score from cache");
  const cached = loadValue<{ version: number; value: number }>(
    "device-performance"
  );

  if (cached && cached.version === performanceDataVersion) {
    return;
  }

  console.log("Performance score not found, calculating");

  const startTime = Date.now();
  const iterations = 500_000_000;

  for (let i = 0; i < iterations; i++) {
    Math.pow(Math.random(), 2);
  }

  const ellapsedTime = Date.now() - startTime;

  console.log(`Performance score is ${ellapsedTime}, less is better`);

  saveValue("device-performance", {
    version: performanceDataVersion,
    value: ellapsedTime,
  });

  return;
}

export function getDevicePerformance() {
  const cached = loadValue<{ version: number; value: number }>(
    "device-performance"
  );

  if (cached && cached.version === performanceDataVersion) {
    return cached.value;
  }

  retryDevicePerformance();

  // Prevent everything else from breaking
  return 0;
}

const BreakpointContext = createContext<
  { isMobile: boolean; isDesktop: boolean } | undefined
>(undefined);

export function BreakpointProvider({
  onChange,
  children,
}: {
  onChange: (value: { isMobile: boolean; isDesktop: boolean }) => void;
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const value = useMemo(() => {
    return { isMobile: mobile, isDesktop: !mobile };
  }, [mobile]);

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

export const isNewTab = false;
