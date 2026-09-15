/**
 * Gripwell - Authentication, Role & Workspace Context
 * Manages user authentication state, active roles, profiles, and terminal routing.
 * Separates authenticatedRole (user's credential tier) from activeRole (current view).
 */

import React, { createContext, useContext, useState } from "react";
import {
    DEV_ACCOUNTS,
    validateCredentials,
} from "../services/auth/devCredentials";
import { StaffProfile, UserRole } from "../types/roles";

export interface RoleContextType {
  isAuthenticated: boolean;
  authenticatedRole: UserRole;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  staff: StaffProfile;
  terminalHub: string;
  setTerminalHub: (hub: string) => void;
  login: (
    identifier: string,
    pass: string,
  ) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (role: UserRole) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // Starts unauthenticated by default so Login screen is presented
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticatedRole, setAuthenticatedRole] =
    useState<UserRole>("office");
  const [activeRole, setActiveRoleState] = useState<UserRole>("office");
  const [staff, setStaff] = useState<StaffProfile>(DEV_ACCOUNTS.office.profile);
  const [terminalHub, setTerminalHub] = useState<string>(
    DEV_ACCOUNTS.office.profile.hub,
  );

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    const account = DEV_ACCOUNTS[role];
    if (account) {
      setStaff(account.profile);
      setTerminalHub(account.profile.hub);
    }
  };

  const login = async (
    identifier: string,
    pass: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const result = validateCredentials(identifier, pass);
    if (!result.success || !result.account) {
      return { success: false, error: result.error || "Authentication failed" };
    }

    const { account } = result;
    setAuthenticatedRole(account.role);
    setActiveRoleState(account.role);
    setStaff(account.profile);
    setTerminalHub(account.profile.hub);
    setIsAuthenticated(true);
    return { success: true };
  };

  const quickLogin = (role: UserRole) => {
    const account = DEV_ACCOUNTS[role];
    if (account) {
      setAuthenticatedRole(account.role);
      setActiveRoleState(account.role);
      setStaff(account.profile);
      setTerminalHub(account.profile.hub);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <RoleContext.Provider
      value={{
        isAuthenticated,
        authenticatedRole,
        activeRole,
        setActiveRole,
        staff,
        terminalHub,
        setTerminalHub,
        login,
        quickLogin,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext(): RoleContextType {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}
