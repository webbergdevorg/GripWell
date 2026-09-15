/**
 * Gripwell - Development & Testing Credentials Service
 * Provides pre-configured role accounts for quick authentication and testing.
 */

import { StaffProfile, UserRole } from "../../types/roles";

export interface DevAccount {
  id: string;
  role: UserRole;
  roleLabel: string;
  email: string;
  username: string;
  password: string;
  profile: StaffProfile;
  description: string;
  defaultRoute: string;
}

export const DEV_ACCOUNTS: Record<UserRole, DevAccount> = {
  supervisor: {
    id: "dev-sup-01",
    role: "supervisor",
    roleLabel: "Supervisor",
    email: "supervisor@gripwell.io",
    username: "supervisor",
    password: "password123",
    description: "Outbound Dispatch, Bay Loading, Gate Pass & Rate Masking",
    defaultRoute: "/(supervisor)/dispatch",
    profile: {
      id: "staff-sup-01",
      name: "R. Kumar",
      initials: "RK",
      role: "supervisor",
      hub: "Salem Yard Bay 3",
    },
  },
  office: {
    id: "dev-off-01",
    role: "office",
    roleLabel: "Office Admin",
    email: "office@gripwell.io",
    username: "office",
    password: "password123",
    description: "Billing Workspace, Credit Ledger & Advance Payments",
    defaultRoute: "/(office)/billing",
    profile: {
      id: "staff-off-01",
      name: "M. Vance",
      initials: "MV",
      role: "office",
      hub: "Chicago Metro Hub",
    },
  },
  owner: {
    id: "dev-own-01",
    role: "owner",
    roleLabel: "Owner Console",
    email: "owner@gripwell.io",
    username: "owner",
    password: "password123",
    description: "Fiscal Oversight, Executive Dashboard & Reconciliation",
    defaultRoute: "/(owner)/dashboard",
    profile: {
      id: "staff-own-01",
      name: "S. Rajesh",
      initials: "SR",
      role: "owner",
      hub: "Executive Headquarters",
    },
  },
};

/**
 * Validates provided credentials against the developer accounts database.
 * Accepts email or username (case-insensitive).
 */
export function validateCredentials(
  identifier: string,
  pass: string,
): { success: boolean; account?: DevAccount; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanId) {
    return {
      success: false,
      error: "Please enter your username or work email.",
    };
  }

  if (!cleanPass) {
    return { success: false, error: "Please enter your password." };
  }

  const account = Object.values(DEV_ACCOUNTS).find(
    (acc) =>
      acc.email.toLowerCase() === cleanId ||
      acc.username.toLowerCase() === cleanId ||
      acc.role.toLowerCase() === cleanId,
  );

  if (!account) {
    return {
      success: false,
      error:
        "Account not found. Use dev credentials (e.g. supervisor@gripwell.io).",
    };
  }

  if (account.password !== cleanPass) {
    return {
      success: false,
      error: "Invalid password. Default testing password is 'password123'.",
    };
  }

  return { success: true, account };
}

/**
 * Hierarchical Role Access Configuration:
 * - supervisor: Can ONLY access supervisor workspace
 * - office: Can ONLY access office workspace (requires respective credentials for other workspaces)
 * - owner: Can access ALL workspaces (owner, office, supervisor)
 */
export const ROLE_PERMISSIONS: Record<UserRole, UserRole[]> = {
  supervisor: ["supervisor"],
  office: ["office"],
  owner: ["owner", "office", "supervisor"],
};

/**
 * Returns true if currentRole has access to the targetRole workspace.
 */
export function hasWorkspaceAccess(
  currentRole: UserRole,
  targetRole: UserRole,
): boolean {
  const allowed = ROLE_PERMISSIONS[currentRole];
  return allowed ? allowed.includes(targetRole) : false;
}
