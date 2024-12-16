import { Breakpoint } from "@mui/material";
import { useCurrentBreakpoint } from "./useCurrentBreakpoint";

export function useBreakpointValue<T>(values: Record<Breakpoint, T>) {
  return values[useCurrentBreakpoint()];
}
