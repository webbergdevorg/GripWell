/**
 * Gripwell - Navigation: OfficeWorkspaceShell
 * Unified, visually stable shell for Office Admin workspace with 3 compact tabs:
 * 1. Billing
 * 2. Credit Ledger
 * 3. Advance Payments
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import { useRoleContext } from "../../hooks/useRoleContext";
import { Text } from "../ui/Text";
import { RoleSwitcherPills } from "./RoleSwitcherPills";

export type OfficeTab = "billing" | "credits" | "advances";

interface OfficeWorkspaceShellProps {
  activeTab: OfficeTab;
  children: React.ReactNode;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  headerRightActions?: React.ReactNode;
}

const OFFICE_TABS: { id: OfficeTab; label: string; route: string }[] = [
  { id: "billing", label: "Billing", route: "/(office)/billing" },
  { id: "credits", label: "Credit Ledger", route: "/(office)/credits" },
  { id: "advances", label: "Advance Payments", route: "/(office)/advances" },
];

export const OfficeWorkspaceShell: React.FC<OfficeWorkspaceShellProps> = ({
  activeTab,
  children,
  searchPlaceholder = "Search customer, load, invoice...",
  searchQuery,
  onSearchChange,
  headerRightActions,
}) => {
  const insets = useSafeAreaInsets();
  const { isDesktop } = useResponsive();
  const { staff, logout, isAdmin } = useRoleContext();

  const handleTabPress = (tab: OfficeTab, route: string) => {
    if (tab === activeTab) return;
    router.replace(route as any);
  };

  const handleSignOut = () => {
    logout();
    router.replace("/login" as any);
  };

  return (
    <View style={styles.shellContainer}>
      {/* Top Header */}
      {isDesktop ? (
        <View style={styles.desktopHeader}>
          <View style={styles.desktopHeaderInner}>
            {/* Left: Brand & Workspace Title */}
            <View style={styles.headerLeft}>
              <View style={styles.brandBox}>
                <View style={styles.logoIcon}>
                  <MaterialIcons
                    name="local-shipping"
                    size={15}
                    color="#FFFFFF"
                  />
                </View>
                <Text variant="labelMd" style={styles.brandTitle}>
                  Gripwell
                </Text>
              </View>
              <View style={styles.vDivider} />
              <View style={styles.workspacePill}>
                <Text variant="labelSm" color={COLORS.textSecondary}>
                  Office Admin
                </Text>
              </View>
            </View>

            {/* Center: Admin Workspace Switcher - Centered */}
            {isAdmin && (
              <View style={styles.desktopRoleCenter}>
                <RoleSwitcherPills compact />
              </View>
            )}

            {/* Right: Search, Hub, Staff Profile & Sign Out */}
            <View style={styles.headerRight}>
              {onSearchChange && (
                <View style={styles.searchBox}>
                  <MaterialIcons
                    name="search"
                    size={15}
                    color={COLORS.textMuted}
                    style={styles.searchIcon}
                  />
                  <RNTextInput
                    placeholder={searchPlaceholder}
                    placeholderTextColor={COLORS.textMuted}
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    style={styles.searchInput}
                  />
                </View>
              )}

              {headerRightActions}

              <View style={styles.vDivider} />

              <Pressable
                onPress={handleSignOut}
                style={({ pressed }: any) => [
                  styles.signOutBtn,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Sign out"
              >
                <MaterialIcons
                  name="logout"
                  size={14}
                  color={COLORS.textSecondary}
                />
                <Text
                  variant="bodySm"
                  color={COLORS.textSecondary}
                  style={{ fontWeight: "500" }}
                >
                  Sign Out
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Desktop Subordinate Tab Bar */}
          <View style={styles.desktopTabBar}>
            <View style={styles.tabsRow}>
              {OFFICE_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => handleTabPress(tab.id, tab.route)}
                    style={[
                      styles.desktopTabItem,
                      isActive && styles.desktopTabItemActive,
                    ]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      variant="labelSm"
                      color={
                        isActive ? COLORS.textPrimary : COLORS.textSecondary
                      }
                      style={[
                        styles.desktopTabText,
                        isActive && styles.desktopTabTextActive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                    {isActive && <View style={styles.activeTabUnderline} />}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        /* Mobile Sticky Header with Compact Tabs */
        <View
          style={[
            styles.mobileHeader,
            { paddingTop: Math.max(insets.top, 10) },
          ]}
        >
          {isAdmin && (
            <View style={styles.mobileRoleRow}>
              <RoleSwitcherPills compact />
            </View>
          )}
          <View style={styles.mobileTopRow}>
            <View style={styles.mobileBrand}>
              <View style={styles.logoIconSmall}>
                <MaterialIcons
                  name="local-shipping"
                  size={13}
                  color="#FFFFFF"
                />
              </View>
              <Text variant="labelMd" style={styles.brandTitle}>
                Gripwell
              </Text>
              <Text variant="bodySm" color={COLORS.textMuted}>
                / Office
              </Text>
            </View>

            <View style={styles.mobileRightActions}>
              <View style={styles.avatarSmall}>
                <Text variant="labelSm" style={styles.avatarTextSmall}>
                  {staff.initials}
                </Text>
              </View>
              <Pressable
                onPress={handleSignOut}
                style={styles.mobileLogoutBtn}
                accessibilityRole="button"
                accessibilityLabel="Sign out"
              >
                <MaterialIcons
                  name="logout"
                  size={15}
                  color={COLORS.textSecondary}
                />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Main Content Workspace */}
      <View
        style={[
          styles.contentContainer,
          !isDesktop && {
            paddingBottom: 60 + Math.max(insets.bottom, 12),
          },
        ]}
      >
        {children}
      </View>

      {/* Fixed Mobile Bottom Navigation */}
      {!isDesktop && (
        <View
          style={[
            styles.mobileBottomNav,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={styles.mobileBottomNavRow}>
            {OFFICE_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const iconName =
                tab.id === "billing"
                  ? "receipt-long"
                  : tab.id === "credits"
                    ? "account-balance-wallet"
                    : "payments";
              const mobileLabel = tab.id === "advances" ? "Advance" : tab.label;

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => handleTabPress(tab.id, tab.route)}
                  style={({ pressed }: any) => [
                    styles.mobileBottomNavItem,
                    isActive && styles.mobileBottomNavItemActive,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={tab.label}
                >
                  <MaterialIcons
                    name={iconName as any}
                    size={20}
                    color={isActive ? COLORS.primary : COLORS.textMuted}
                  />
                  <Text
                    variant="labelSm"
                    color={isActive ? COLORS.primary : COLORS.textMuted}
                    style={[
                      styles.mobileBottomNavLabel,
                      isActive && styles.mobileBottomNavLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {mobileLabel}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shellContainer: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  contentContainer: {
    flex: 1,
  },

  // Desktop Header
  desktopHeader: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 40,
  },
  desktopHeaderInner: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceXl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceMd,
  },
  brandBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  vDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.border,
  },
  workspacePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.xs,
  },
  desktopRoleCenter: {
    width: 340,
    marginHorizontal: SPACING.spaceBase,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceMd,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    height: 30,
    width: 240,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
    padding: 0,
    ...Platform.select({
      web: { outlineStyle: "none" as any },
    }),
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  staffName: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  pressed: {
    opacity: 0.75,
  },

  // Desktop Subordinate Tab Bar
  desktopTabBar: {
    height: 38,
    paddingHorizontal: SPACING.spaceXl,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
  },
  tabsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: SPACING.spaceXl,
  },
  desktopTabItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 4,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  desktopTabItemActive: {},
  desktopTabText: {
    fontSize: 13,
    fontWeight: "500",
  },
  desktopTabTextActive: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  activeTabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
  },

  // Mobile Header
  mobileHeader: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 40,
  },
  mobileRoleRow: {
    paddingHorizontal: SPACING.spaceBase,
    paddingTop: 4,
    paddingBottom: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileTopRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceBase,
  },
  mobileBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoIconSmall: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTextSmall: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  mobileLogoutBtn: {
    padding: 5,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Mobile Bottom Navigation Bar
  mobileBottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    ...Platform.select({
      web: {
        boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
        zIndex: 100,
      },
      default: {
        elevation: 8,
      },
    }),
  },
  mobileBottomNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: SPACING.spaceSm,
  },
  mobileBottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 3,
    ...Platform.select({
      web: {
        cursor: "pointer",
        userSelect: "none",
        transitionProperty: "background-color, color",
        transitionDuration: "150ms",
      },
    }),
  },
  mobileBottomNavItemActive: {
    backgroundColor: "rgba(32, 138, 239, 0.08)",
  },
  mobileBottomNavLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  mobileBottomNavLabelActive: {
    fontWeight: "700",
    color: COLORS.primary,
  },
});
