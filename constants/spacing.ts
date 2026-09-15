/**
 * Gripwell - Design Tokens: Spacing, Radius & Shadows
 * Extracted directly from Google Stitch design system specification:
 * "Dispatch & Logistics Intelligence" (Design MD)
 */

export const SPACING = {
  space2xs: 2,
  spaceXs: 4,
  spaceSm: 8,
  spaceMd: 12,
  spaceBase: 16,
  spaceLg: 20,
  spaceXl: 24,
  space2xl: 32,
  space3xl: 48,

  gutterCompact: 8,
  gutterNormal: 16,

  tableRowDense: 36,
  tableRowNormal: 44,
  sidebarWidth: 256,
  headerHeight: 56,
  mobileHeaderHeight: 48,
} as const;

export const RADIUS = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

import { Platform } from "react-native";

export const SHADOWS = {
  none: Platform.select({
    web: { boxShadow: "none" },
    default: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  }),
  xs: Platform.select({
    web: { boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" },
    default: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
  }),
  sm: Platform.select({
    web: { boxShadow: "0 2px 4px rgba(15, 23, 42, 0.06)" },
    default: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
  }),
  md: Platform.select({
    web: { boxShadow: "0 4px 8px rgba(15, 23, 42, 0.08)" },
    default: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
  }),
} as const;
