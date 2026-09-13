/**
 * Gripwell - Design Tokens: Typography
 * Extracted directly from Google Stitch design system specification:
 * "Dispatch & Logistics Intelligence" (Design MD)
 */

import { Platform, TextStyle } from "react-native";

const fontFamilySans = Platform.select({
  ios: "System",
  android: "sans-serif",
  web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  default: "System",
});

const fontFamilyMono = Platform.select({
  ios: "Courier New",
  android: "monospace",
  web: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  default: "monospace",
});

export const TYPOGRAPHY = {
  headlineXl: {
    fontFamily: fontFamilySans,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "600",
    letterSpacing: -0.75,
  } as TextStyle,

  headlineLg: {
    fontFamily: fontFamilySans,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    letterSpacing: -0.48,
  } as TextStyle,

  headlineLgMobile: {
    fontFamily: fontFamilySans,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    letterSpacing: -0.3,
  } as TextStyle,

  headlineMd: {
    fontFamily: fontFamilySans,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    letterSpacing: -0.27,
  } as TextStyle,

  headlineSm: {
    fontFamily: fontFamilySans,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: -0.15,
  } as TextStyle,

  bodyLg: {
    fontFamily: fontFamilySans,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: -0.075,
  } as TextStyle,

  bodyMd: {
    fontFamily: fontFamilySans,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400",
    letterSpacing: 0,
  } as TextStyle,

  bodySm: {
    fontFamily: fontFamilySans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    letterSpacing: 0,
  } as TextStyle,

  labelMd: {
    fontFamily: fontFamilySans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    letterSpacing: -0.065,
  } as TextStyle,

  labelSm: {
    fontFamily: fontFamilySans,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 0.33,
  } as TextStyle,

  tabularData: {
    fontFamily: fontFamilySans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    letterSpacing: -0.13,
    fontVariant: ["tabular-nums"],
  } as TextStyle,

  tabularMono: {
    fontFamily: fontFamilyMono,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof TYPOGRAPHY;
