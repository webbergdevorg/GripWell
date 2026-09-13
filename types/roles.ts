/**
 * Gripwellles & Permission Types
 */

export type UserRole = "supervisor" | "office" | "owner";

export interface StaffProfile {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  hub: string;
}
