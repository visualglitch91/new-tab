import { createContext, useContext, useEffect, useMemo } from "react";
import { loadValue, saveValue } from "./storage";
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
export function getDevicePerformance() {
  const version = 1;
  const cached = loadValue<{ version: number; value: number }>(
    "device-performance"
  );

  if (cached?.version === version) {
    return cached.value;
  }

  const startTime = performance.now(); // Get the current time in milliseconds
  const iterations = 100_000_000; // Adjust the number of iterations as needed

  // Perform a simple mathematical operation repeatedly
  for (let i = 0; i < iterations; i++) {
    // You can choose any mathematical operation here
    // For example, squaring a number
    Math.pow(Math.random(), 2);
  }

  const endTime = performance.now(); // Get the time after the loop

  // Calculate the time it took to complete the iterations in milliseconds
  const ellapsedTime = endTime - startTime;

  saveValue("device-performance", {
    version,
    value: ellapsedTime,
  });

  return ellapsedTime;
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
