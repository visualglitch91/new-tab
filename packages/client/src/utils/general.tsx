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

const performanceDataVersion = 6;

export function calculateDevicePerformance() {
  const cached = loadValue<{ version: number; value: number }>(
    "device-performance"
  );

  if (cached && cached.version === performanceDataVersion) {
    return;
  }

  const startTime = performance.now(); // Get the current time in milliseconds
  const iterations = 1_000_000; // Adjust the number of iterations as needed

  // Perform a simple mathematical operation repeatedly
  for (let i = 0; i < iterations; i++) {
    // You can choose any mathematical operation here
    // For example, squaring a number
    Math.pow(Math.random(), 2);
  }

  const endTime = performance.now(); // Get the time after the loop

  // Calculate the time it took to complete the iterations in milliseconds
  const ellapsedTime = endTime - startTime;

  alert(ellapsedTime);

  saveValue("device-performance", {
    version: performanceDataVersion,
    value: ellapsedTime,
  });
}

export function getDevicePerformance() {
  const cached = loadValue<{ version: number; value: number }>(
    "device-performance"
  );

  if (cached && cached.version === performanceDataVersion) {
    return cached.value;
  }

  clearValue("device-performance");
  window.location.reload();
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
