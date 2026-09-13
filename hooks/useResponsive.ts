/**
 * Gripwell - Responsive Layout Hook
 */

import { useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "../constants/breakpoints";

export interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWideDesktop: boolean;
}

export function useResponsive(): ResponsiveState {
  const { width, height } = useWindowDimensions();

  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;
  const isWideDesktop = width >= BREAKPOINTS.wideDesktop;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isWideDesktop,
  };
}
