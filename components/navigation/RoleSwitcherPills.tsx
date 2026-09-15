/**
 * Gripwell - Navigation: RoleSwitcherPills
 * Exact 3-way role segmented control with Hierarchical Role Protection.
 * Shows locked indicators (🔒) for roles requiring elevated credentials.
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS } from "../../constants/spacing";
import { useRoleContext } from "../../hooks/useRoleContext";
import { hasWorkspaceAccess } from "../../services/auth/devCredentials";
import { UserRole } from "../../types/roles";
import { SwitchRoleModal } from "../domain/SwitchRoleModal";
import { Text } from "../ui/Text";

export const RoleSwitcherPills: React.FC<{ compact?: boolean }> = ({
  compact = true,
}) => {
  const pathname = usePathname();
  const { activeRole, setActiveRole, authenticatedRole } = useRoleContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [targetRole, setTargetRole] = useState<UserRole | null>(null);

  const roles: { id: UserRole; label: string }[] = [
    { id: "supervisor", label: "Supervisor" },
    { id: "office", label: "Office Admin" },
    { id: "owner", label: "Owner Console" },
  ];

  // Keep activeRole synchronized when route pathname changes
  useEffect(() => {
    if (pathname) {
      const normalized = pathname.toLowerCase();
      if (
        normalized.includes("owner") ||
        normalized.includes("dashboard") ||
        normalized.includes("product")
      ) {
        if (
          activeRole !== "owner" &&
          hasWorkspaceAccess(authenticatedRole, "owner")
        ) {
          setActiveRole("owner");
        }
      } else if (
        normalized.includes("dispatch") ||
        normalized.includes("gate-pass") ||
        normalized.includes("supervisor")
      ) {
        if (
          activeRole !== "supervisor" &&
          hasWorkspaceAccess(authenticatedRole, "supervisor")
        ) {
          setActiveRole("supervisor");
        }
      } else if (
        normalized.includes("billing") ||
        normalized.includes("credit") ||
        normalized.includes("advance") ||
        normalized.includes("office")
      ) {
        if (
          activeRole !== "office" &&
          hasWorkspaceAccess(authenticatedRole, "office")
        ) {
          setActiveRole("office");
        }
      }
    }
  }, [pathname, authenticatedRole]);

  const navigateToRoleWorkspace = (role: UserRole) => {
    setActiveRole(role);
    if (role === "supervisor") {
      router.replace("/(supervisor)/dispatch" as any);
    } else if (role === "office") {
      router.replace("/(office)/billing" as any);
    } else if (role === "owner") {
      router.replace("/(owner)/dashboard" as any);
    }
  };

  const handleRolePress = (role: UserRole) => {
    if (activeRole === role) return;

    // Check hierarchical access against user's authenticated credential tier
    const isAllowed = hasWorkspaceAccess(authenticatedRole, role);

    if (isAllowed) {
      // Free transition (e.g. Owner -> Office/Supervisor, Office -> Supervisor)
      navigateToRoleWorkspace(role);
    } else {
      // Requires elevated credentials -> open authentication modal
      setTargetRole(role);
      setModalVisible(true);
    }
  };

  return (
    <>
      <View style={[styles.container, compact && styles.compactContainer]}>
        {roles.map((r, idx) => {
          const isActive = activeRole === r.id;
          const isAllowed = hasWorkspaceAccess(authenticatedRole, r.id);
          const isFirst = idx === 0;
          const isLast = idx === roles.length - 1;

          return (
            <Pressable
              key={r.id}
              onPress={() => handleRolePress(r.id)}
              style={({ pressed }: any) => [
                styles.pill,
                compact && styles.compactPill,
                isFirst && styles.firstPill,
                isLast && styles.lastPill,
                isActive ? styles.activePill : styles.inactivePill,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${r.label}${!isAllowed ? " (Locked - requires credentials)" : ""}`}
            >
              <View style={styles.pillInnerRow}>
                {!isAllowed && !isActive && (
                  <MaterialIcons
                    name="lock"
                    size={11}
                    color="#94A3B8"
                    style={{ marginRight: 3 }}
                  />
                )}
                <Text
                  variant="labelSm"
                  style={[
                    styles.label,
                    compact && styles.compactLabel,
                    isActive ? styles.activeLabel : styles.inactiveLabel,
                  ]}
                  numberOfLines={1}
                >
                  {r.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Re-Authentication Modal for elevated roles */}
      <SwitchRoleModal
        visible={modalVisible}
        targetRole={targetRole}
        onClose={() => {
          setModalVisible(false);
          setTargetRole(null);
        }}
        onSuccess={(newRole) => {
          navigateToRoleWorkspace(newRole);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: RADIUS.sm,
    padding: 2,
    width: "100%",
  },
  compactContainer: {
    padding: 2,
  },
  pill: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: RADIUS.xs,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
        transitionProperty: "background-color, color, box-shadow",
        transitionDuration: "150ms",
      },
    }),
  },
  pillInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  compactPill: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  firstPill: {
    borderTopLeftRadius: RADIUS.xs,
    borderBottomLeftRadius: RADIUS.xs,
  },
  lastPill: {
    borderTopRightRadius: RADIUS.xs,
    borderBottomRightRadius: RADIUS.xs,
  },
  activePill: {
    backgroundColor: COLORS.primary, // #0F172A (Slate 900)
    ...Platform.select({
      web: {
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.12)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
  inactivePill: {
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
  },
  compactLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
  },
  activeLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  inactiveLabel: {
    color: "#64748B",
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});
