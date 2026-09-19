/**
 * Gripwell - Navigation: DesktopHeader
 * Sticky 56px desktop header from Stitch.
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useRoleContext } from "../../hooks/useRoleContext";
import { hasWorkspaceAccess } from "../../services/auth/devCredentials";
import { Text } from "../ui/Text";
import { RoleSwitcherPills } from "./RoleSwitcherPills";

export interface DesktopHeaderProps {
  onSearchChange?: (query: string) => void;
  activeSection?: "dispatch" | "billing" | "credits" | "advances" | "audit";
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  onSearchChange,
  activeSection: propActiveSection,
}) => {
  const pathname = usePathname();
  const { staff, terminalHub, activeRole, setActiveRole, logout, isAdmin } =
    useRoleContext();

  // URL / route is the primary source of truth on Web/Desktop,
  // supplemented by propActiveSection or activeRole fallback.
  const effectiveSection = useMemo(() => {
    if (propActiveSection) {
      return propActiveSection;
    }
    if (pathname) {
      const normalized = pathname.toLowerCase();
      if (normalized.includes("advances") || normalized.includes("advance")) {
        return "advances";
      }
    }
    if (activeRole === "supervisor") return "dispatch";
    if (activeRole === "owner") return "audit";
    return "billing";
  }, [propActiveSection, pathname, activeRole]);

  const isOfficePage = useMemo(() => {
    if (propActiveSection) {
      return (
        propActiveSection === "billing" ||
        propActiveSection === "credits" ||
        propActiveSection === "advances"
      );
    }
    if (pathname) {
      const normalized = pathname.toLowerCase();
      if (
        normalized.includes("billing") ||
        normalized.includes("credit") ||
        normalized.includes("advance")
      ) {
        return true;
      }
      if (normalized.includes("dispatch") || normalized.includes("gate-pass")) {
        return false;
      }
    }
    return activeRole === "office";
  }, [propActiveSection, pathname, activeRole]);

  const isOwnerWorkspace = useMemo(() => {
    if (propActiveSection) {
      return propActiveSection === "audit";
    }
    if (pathname) {
      const normalized = pathname.toLowerCase();
      if (
        normalized.includes("owner") ||
        normalized.includes("dashboard") ||
        normalized.includes("product")
      ) {
        return true;
      }
      if (
        normalized.includes("dispatch") ||
        normalized.includes("gate-pass") ||
        normalized.includes("billing") ||
        normalized.includes("credit") ||
        normalized.includes("advance")
      ) {
        return false;
      }
    }
    return activeRole === "owner";
  }, [propActiveSection, pathname, activeRole]);

  return (
    <View style={[styles.headerWrapper, webHeaderStyle]}>
      <View style={styles.container}>
        {/* Left: Brand & Navigation */}
        <View style={styles.leftSection}>
          {/* Brand Logo & Name */}
          <Pressable
            onPress={() => {
              if (activeRole === "supervisor") {
                router.replace("/(supervisor)/dispatch" as any);
              } else if (activeRole === "owner") {
                router.replace("/(owner)/dashboard" as any);
              } else {
                router.replace("/(office)/billing" as any);
              }
            }}
            style={styles.brand}
            accessibilityRole="link"
          >
            <View style={styles.logoIcon}>
              <MaterialIcons name="local-shipping" size={16} color="#FFFFFF" />
            </View>
            <Text variant="labelMd" style={styles.brandTitle}>
              Gripwell
            </Text>
          </Pressable>

          <View style={styles.vDivider} />

          {/* Nav Links - Rendered by Access Permission */}
          <View style={styles.navLinks}>
            {/* Dispatch - Hidden on Office Admin pages */}
            {!isOfficePage && hasWorkspaceAccess(activeRole, "supervisor") && (
              <Pressable
                onPress={() => {
                  if (
                    activeRole !== "supervisor" &&
                    hasWorkspaceAccess(activeRole, "supervisor")
                  ) {
                    setActiveRole("supervisor");
                  }
                  router.replace("/(supervisor)/dispatch" as any);
                }}
                style={[
                  styles.navLinkItem,
                  effectiveSection === "dispatch" && styles.activeNavLinkItem,
                ]}
                accessibilityRole="link"
                accessibilityState={{
                  selected: effectiveSection === "dispatch",
                }}
              >
                <Text
                  variant="labelSm"
                  color={
                    effectiveSection === "dispatch"
                      ? COLORS.textPrimary
                      : COLORS.textSecondary
                  }
                  style={
                    effectiveSection === "dispatch"
                      ? styles.activeNavText
                      : styles.navText
                  }
                >
                  Dispatch
                </Text>
              </Pressable>
            )}

            {/* Office Admin Links - Office, Owner */}
            {hasWorkspaceAccess(activeRole, "office") && (
              <>
                <Pressable
                  onPress={() => {
                    if (
                      activeRole !== "office" &&
                      hasWorkspaceAccess(activeRole, "office")
                    ) {
                      setActiveRole("office");
                    }
                    router.replace("/(office)/billing" as any);
                  }}
                  style={[
                    styles.navLinkItem,
                    effectiveSection === "billing" && styles.activeNavLinkItem,
                  ]}
                  accessibilityRole="link"
                  accessibilityState={{
                    selected: effectiveSection === "billing",
                  }}
                >
                  <Text
                    variant="labelSm"
                    color={
                      effectiveSection === "billing"
                        ? COLORS.textPrimary
                        : COLORS.textSecondary
                    }
                    style={
                      effectiveSection === "billing"
                        ? styles.activeNavText
                        : styles.navText
                    }
                  >
                    Billing
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    if (
                      activeRole !== "office" &&
                      hasWorkspaceAccess(activeRole, "office")
                    ) {
                      setActiveRole("office");
                    }
                    router.replace("/(office)/credits" as any);
                  }}
                  style={[
                    styles.navLinkItem,
                    effectiveSection === "credits" && styles.activeNavLinkItem,
                  ]}
                  accessibilityRole="link"
                  accessibilityState={{
                    selected: effectiveSection === "credits",
                  }}
                >
                  <Text
                    variant="labelSm"
                    color={
                      effectiveSection === "credits"
                        ? COLORS.textPrimary
                        : COLORS.textSecondary
                    }
                    style={
                      effectiveSection === "credits"
                        ? styles.activeNavText
                        : styles.navText
                    }
                  >
                    Credit Ledger
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    if (
                      activeRole !== "office" &&
                      hasWorkspaceAccess(activeRole, "office")
                    ) {
                      setActiveRole("office");
                    }
                    router.replace("/(office)/advances" as any);
                  }}
                  style={[
                    styles.navLinkItem,
                    effectiveSection === "advances" && styles.activeNavLinkItem,
                  ]}
                  accessibilityRole="link"
                  accessibilityState={{
                    selected: effectiveSection === "advances",
                  }}
                >
                  <Text
                    variant="labelSm"
                    color={
                      effectiveSection === "advances"
                        ? COLORS.textPrimary
                        : COLORS.textSecondary
                    }
                    style={
                      effectiveSection === "advances"
                        ? styles.activeNavText
                        : styles.navText
                    }
                  >
                    Advance Payments
                  </Text>
                </Pressable>
              </>
            )}

            {/* Owner Links - Owner only */}
            {hasWorkspaceAccess(activeRole, "owner") && (
              <Pressable
                onPress={() => {
                  setActiveRole("owner");
                  router.replace("/(owner)/dashboard" as any);
                }}
                style={[
                  styles.navLinkItem,
                  effectiveSection === "audit" && styles.activeNavLinkItem,
                ]}
                accessibilityRole="link"
                accessibilityState={{ selected: effectiveSection === "audit" }}
              >
                <Text
                  variant="labelSm"
                  color={
                    effectiveSection === "audit"
                      ? COLORS.textPrimary
                      : COLORS.textSecondary
                  }
                  style={
                    effectiveSection === "audit"
                      ? styles.activeNavText
                      : styles.navText
                  }
                >
                  Executive Fiscal
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Center: Role Switcher - for Admin users across workspaces */}
        {isAdmin && (
          <View style={styles.centerSection}>
            <RoleSwitcherPills compact />
          </View>
        )}

        {/* Right: Search, Terminal Hub, Profile */}
        <View style={styles.rightSection}>
          {/* Search Input */}
          <View style={styles.searchBox}>
            <MaterialIcons
              name="search"
              size={16}
              color={COLORS.textMuted}
              style={styles.searchIcon}
            />
            <RNTextInput
              placeholder="Search load, invoice, customer..."
              placeholderTextColor={COLORS.textMuted}
              onChangeText={onSearchChange}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.vDivider} />

          {/* Sign Out Button */}
          <Pressable
            onPress={() => {
              logout();
              router.replace("/login" as any);
            }}
            style={({ pressed, hovered }: any) => [
              styles.signOutBtn,
              hovered && styles.signOutBtnHover,
              pressed && styles.signOutBtnPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sign out of terminal"
          >
            <MaterialIcons
              name="logout"
              size={14}
              color={COLORS.textSecondary}
            />
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.signOutText}
            >
              Sign Out
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const webHeaderStyle = Platform.select({
  web: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    width: "100%",
    backgroundColor: COLORS.surface,
  },
  default: {},
}) as any;

const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
    zIndex: 30,
    backgroundColor: COLORS.surface,
  },
  centerSection: {
    width: 340,
    marginHorizontal: SPACING.spaceBase,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    height: SPACING.headerHeight,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceXl,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceBase,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm + 2,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontWeight: "600",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  vDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceLg,
  },
  navLinkItem: {
    paddingVertical: 18,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  activeNavLinkItem: {
    borderBottomColor: COLORS.primary,
  },
  navText: {
    fontWeight: "500",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  activeNavText: {
    fontWeight: "600",
  },
  rightSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceBase,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    width: 250,
    height: 32,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceSm,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 12,
    color: COLORS.textPrimary,
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
      },
    }),
  },
  hubIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hubDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981", // Emerald active pulse
  },
  hubText: {
    fontSize: 12,
    fontWeight: "400",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    paddingLeft: SPACING.spaceXs,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  staffName: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSecondary,
    ...Platform.select({
      web: {
        cursor: "pointer",
        transitionProperty: "background-color, border-color",
        transitionDuration: "150ms",
      },
    }),
  },
  signOutBtnHover: {
    backgroundColor: "#E2E8F0",
    borderColor: "#CBD5E1",
  },
  signOutBtnPressed: {
    opacity: 0.8,
  },
  signOutText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
