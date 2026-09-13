/**
 * Gripwellle & Workspace Context
 */

import React, { createContext, useContext, useState } from "react";
import { StaffProfile, UserRole } from "../types/roles";

interface RoleContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  staff: StaffProfile;
  terminalHub: string;
  setTerminalHub: (hub: string) => void;
}

const defaultStaff: StaffProfile = {
  id: "staff-01",
  name: "M. Vance",
  initials: "MV",
  role: "office",
  hub: "Chicago Metro Hub",
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>("office");
  const [terminalHub, setTerminalHub] = useState<string>("Chicago Metro Hub");

  return (
    <RoleContext.Provider
      value={{
        activeRole,
        setActiveRole,
        staff: { ...defaultStaff, role: activeRole },
        terminalHub,
        setTerminalHub,
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
