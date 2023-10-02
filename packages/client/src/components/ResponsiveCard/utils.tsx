import React, { createContext } from "react";

export interface ResponsiveCardProps {
  title: React.ReactNode;
  titleChildren?: React.ReactNode;
  largerMobileTitle?: boolean;
  stickyMobileTitle?: boolean;
  groups: React.ReactNode[];
  variant?: "auto" | "compact" | "confortable";
  spacing?: number | string;
  contentPadding?: number | string;
}

export const MultipleResponsiveCardContext = createContext<{
  viewSwitcher: React.ReactNode;
  largerMobileTitle?: boolean;
  stickyMobileTitle?: boolean;
} | null>(null);
