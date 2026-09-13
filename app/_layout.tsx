/**
 * Gripwell - Root Application Shell
 */

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RoleProvider } from "../hooks/useRoleContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RoleProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        />
      </RoleProvider>
    </SafeAreaProvider>
  );
}
