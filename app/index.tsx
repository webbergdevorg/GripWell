/**
 * Gripwell - Root Entry Route
 * Dynamically renders the active workspace based on current role.
 */

import { useRoleContext } from "../hooks/useRoleContext";
import OfficeBillingWorkspace from "./(office)/billing";
import OwnerFiscalDashboard from "./(owner)/dashboard";
import SupervisorDispatchScreen from "./(supervisor)/dispatch";

export default function RootIndexRoute() {
  const { activeRole } = useRoleContext();

  if (activeRole === "supervisor") {
    return <SupervisorDispatchScreen />;
  }
  if (activeRole === "owner") {
    return <OwnerFiscalDashboard />;
  }
  return <OfficeBillingWorkspace />;
}
