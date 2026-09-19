import { Redirect, Stack } from "expo-router";
import { useRoleContext } from "../../hooks/useRoleContext";
import { hasWorkspaceAccess } from "../../services/auth/devCredentials";

export default function OfficeLayout() {
  const { isAuthenticated, authenticatedRole } = useRoleContext();

  // If unauthenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // Hierarchical permission check (Office Admin & Owner allowed)
  if (!hasWorkspaceAccess(authenticatedRole, "office")) {
    // If user is a supervisor trying to access office pages, route back to supervisor workspace
    if (authenticatedRole === "supervisor") {
      return <Redirect href="/(supervisor)/dispatch" />;
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
        animation: "none",
      }}
    />
  );
}
