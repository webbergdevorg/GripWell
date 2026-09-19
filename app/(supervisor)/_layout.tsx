/**
 * Gripwell - Supervisor Route Group Layout
 * Protected Layout Guard: accessible by Supervisor, Office Admin, and Owner.
 */

import { Redirect, Stack } from "expo-router";
import { useRoleContext } from "../../hooks/useRoleContext";
import { hasWorkspaceAccess } from "../../services/auth/devCredentials";

export default function SupervisorLayout() {
  const { isAuthenticated, authenticatedRole } = useRoleContext();

  // If unauthenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Hierarchical permission check (Supervisor & Owner allowed)
  if (!hasWorkspaceAccess(authenticatedRole, "supervisor")) {
    if (authenticatedRole === "office") {
      return <Redirect href="/(office)/billing" />;
    }
    if (authenticatedRole === "owner") {
      return <Redirect href="/(owner)/dashboard" />;
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
