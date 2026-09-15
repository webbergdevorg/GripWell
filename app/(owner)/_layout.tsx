/**
 * Gripwell - Owner Route Group Layout
 * Protected Layout Guard: accessible strictly by Owner.
 * Supervisor and Office Admin access is restricted and requires Owner credentials.
 */

import { Redirect, Stack } from "expo-router";
import { useRoleContext } from "../../hooks/useRoleContext";
import { hasWorkspaceAccess } from "../../services/auth/devCredentials";

export default function OwnerLayout() {
  const { isAuthenticated, authenticatedRole } = useRoleContext();

  // If unauthenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Strictly Owner permission check based on authenticated credential tier
  if (!hasWorkspaceAccess(authenticatedRole, "owner")) {
    if (authenticatedRole === "supervisor") {
      return <Redirect href="/(supervisor)/dispatch" />;
    }
    if (authenticatedRole === "office") {
      return <Redirect href="/(office)/billing" />;
    }
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
