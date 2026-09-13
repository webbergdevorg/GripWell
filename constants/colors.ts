/**
 * Gripwell - Design Tokens: Colors
 * Extracted directly from Google Stitch design system specification:
 * "Dispatch & Logistics Intelligence" (Design MD)
 */

export const COLORS = {
  // Brand Primary & Ink
  primary: "#0F172A", // Slate 900 - Brand ink, primary buttons
  primaryHover: "#1E293B", // Slate 800
  onPrimary: "#FFFFFF",

  // Secondary Accent
  secondary: "#2563EB", // Blue 600 - Interactive links, active indicators
  secondaryHover: "#1D4ED8", // Blue 700
  secondaryLight: "#EFF6FF", // Blue 50
  secondaryBorder: "#BFDBFE", // Blue 200

  // Canvas & Surfaces
  canvas: "#F8FAFC", // Slate 50 - Base screen canvas
  surface: "#FFFFFF", // Pure White - Panel, card & modal fill
  surfaceSecondary: "#F1F5F9", // Slate 100 - Header wells, subtle sections
  surfaceMuted: "#F8FAFC", // Slate 50 - Table header rows, zebra hover

  // Borders & Hairlines
  border: "#E2E8F0", // Slate 200 - Primary 1px hairline border
  borderSubtle: "#F1F5F9", // Slate 100 - Table row dividers
  borderFocus: "#0F172A", // Slate 900 - Focus outline ring
  borderDashed: "#CBD5E1", // Slate 300 - File dropzone dashed border

  // Typography Ink Tiers
  textPrimary: "#0F172A", // Slate 900 - Headings, monetary values, high contrast
  textSecondary: "#475569", // Slate 600 - Field labels, table headers, descriptions
  textMuted: "#94A3B8", // Slate 400 - Micro-labels, placeholders, metadata keys
  textSubtle: "#64748B", // Slate 500 - Secondary captions

  // Status: Settled / Paid / Cleared (Emerald)
  statusPaidText: "#065F46", // Emerald 800
  statusPaidBg: "#ECFDF5", // Emerald 50
  statusPaidBorder: "#A7F3D0", // Emerald 200
  statusPaidFill: "#059669", // Emerald 600

  // Status: Pending / Waiting / In-Transit (Amber)
  statusPendingText: "#92400E", // Amber 800
  statusPendingBg: "#FFFBEB", // Amber 50
  statusPendingBorder: "#FDE68A", // Amber 200
  statusPendingFill: "#D97706", // Amber 600

  // Status: Calibrating / In-Progress (Blue)
  statusCalibratingText: "#1D4ED8", // Blue 700
  statusCalibratingBg: "#EFF6FF", // Blue 50
  statusCalibratingBorder: "#BFDBFE", // Blue 200
  statusCalibratingFill: "#2563EB", // Blue 600

  // Status: Overdue / Disputed / Void (Rose)
  statusOverdueText: "#9F1239", // Rose 800
  statusOverdueBg: "#FFF1F2", // Rose 50
  statusOverdueBorder: "#FECDD3", // Rose 200
  statusOverdueFill: "#E11D48", // Rose 600

  // Status: Credit / Net-15 (Violet)
  statusCreditText: "#5B21B6", // Violet 800
  statusCreditBg: "#F5F3FF", // Violet 50
  statusCreditBorder: "#DDD6FE", // Violet 200
  statusCreditFill: "#7C3AED", // Violet 600

  // Status: Advance Pool / Deposits (Sky)
  statusAdvanceText: "#075985", // Sky 800
  statusAdvanceBg: "#F0F9FF", // Sky 50
  statusAdvanceBorder: "#BAE6FD", // Sky 200
  statusAdvanceFill: "#0284C7", // Sky 600
} as const;

export type ColorToken = keyof typeof COLORS;
