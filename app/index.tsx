/**
 * Gripwell - Root Entry Route
 * Authenticates user before rendering designated workspace (Supervisor, Office, Owner).
 */

import { useRoleContext } from "../hooks/useRoleContext";
import OfficeBillingWorkspace from "./(office)/billing";
import OwnerFiscalDashboard from "./(owner)/dashboard";
import SupervisorDispatchScreen from "./(supervisor)/dispatch";
import LoginScreen from "./login";

export default function RootIndexRoute() {
  const { isAuthenticated, activeRole } = useRoleContext();

  // If user is not yet logged in, present Login portal
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Role-based workspace routing
  if (activeRole === "supervisor") {
    return <SupervisorDispatchScreen />;
  }
  if (activeRole === "owner") {
    return <OwnerFiscalDashboard />;
  }
  return <OfficeBillingWorkspace />;
}
