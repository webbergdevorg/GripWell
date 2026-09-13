/**
 * Gripwell - Responsive Breakpoints
 */

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wideDesktop: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
