/**
 * Gripwell - Owner: User Management Screen
 * Dedicated route for Owner Staff & Role Management (/(owner)/users).
 * Supports both Desktop and Mobile views.
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserManagementEmbed } from "../../components/domain/UserManagementEmbed";
import {
    OwnerMobileBottomNav,
    OwnerTab,
} from "../../components/navigation/OwnerMobileBottomNav";
import { RoleSwitcherPills } from "../../components/navigation/RoleSwitcherPills";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import { useRoleContext } from "../../hooks/useRoleContext";

export default function OwnerUsersScreen() {
  const { isDesktop } = useResponsive();
  const insets = useSafeAreaInsets();
  const { staff, terminalHub, isAdmin, logout } = useRoleContext();

  const handleTabChange = (tab: OwnerTab) => {
    if (tab === "dashboard") {
      router.replace("/(owner)/dashboard" as any);
    } else if (tab === "products") {
      router.replace("/(owner)/products" as any);
    }
  };

  // -------------------------------------------------------------
  // DESKTOP VIEW
  // -------------------------------------------------------------
  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Top Header */}
        <View style={styles.desktopTopHeader}>
          <View style={styles.desktopHeaderLeft}>
            <View style={styles.brand}>
              <View style={styles.logoIcon}>
                <MaterialIcons
                  name="local-shipping"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <Text variant="labelMd" style={styles.brandTitle}>
                Gripwell
              </Text>
            </View>

            <View style={styles.vDivider} />

            {/* Owner Navigation: Dashboard | Product Catalog | Users */}
            <View style={styles.ownerNavLinks}>
              <Pressable
                onPress={() => router.replace("/(owner)/dashboard" as any)}
                style={styles.navLinkItem}
                accessibilityRole="tab"
                accessibilityState={{ selected: false }}
              >
                <MaterialIcons
                  name="dashboard"
                  size={15}
                  color={COLORS.textSecondary}
                  style={{ marginRight: 5 }}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.navText}
                >
                  Dashboard
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.replace("/(owner)/products" as any)}
                style={styles.navLinkItem}
                accessibilityRole="tab"
                accessibilityState={{ selected: false }}
              >
                <MaterialIcons
                  name="inventory-2"
                  size={15}
                  color={COLORS.textSecondary}
                  style={{ marginRight: 5 }}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.navText}
                >
                  Product Catalog
                </Text>
              </Pressable>

              <Pressable
                style={[styles.navLinkItem, styles.activeNavLinkItem]}
                accessibilityRole="tab"
                accessibilityState={{ selected: true }}
              >
                <MaterialIcons
                  name="group"
                  size={15}
                  color={COLORS.primary}
                  style={{ marginRight: 5 }}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.primary}
                  style={styles.activeNavText}
                >
                  Users
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Center: Admin Workspace Switcher */}
          {isAdmin && (
            <View style={styles.desktopRoleCenter}>
              <RoleSwitcherPills compact />
            </View>
          )}

          {/* Right Header: Hub & Sign out */}
          <View style={styles.desktopHeaderRight}>
            <View style={styles.hubIndicator}>
              <View style={styles.hubDot} />
              <Text variant="bodySm" color={COLORS.textSecondary}>
                {terminalHub}
              </Text>
            </View>

            <View style={styles.profileBadge}>
              <Text variant="labelSm" style={styles.profileInitials}>
                {staff.initials}
              </Text>
            </View>

            <Button
              title="Sign Out"
              icon="logout"
              variant="secondary"
              size="sm"
              onPress={() => {
                logout();
                router.replace("/login" as any);
              }}
            />
          </View>
        </View>

        {/* Desktop Main Content */}
        <ScrollView
          style={styles.desktopScroll}
          contentContainerStyle={styles.desktopScrollContent}
        >
          <View style={styles.desktopMaxContainer}>
            <UserManagementEmbed isDesktop={true} />
          </View>
        </ScrollView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // MOBILE VIEW
  // -------------------------------------------------------------
  return (
    <View style={styles.mobileContainer}>
      {/* Sticky Mobile Header */}
      <View
        style={[styles.mobileHeader, { paddingTop: Math.max(insets.top, 12) }]}
      >
        {isAdmin && (
          <View style={styles.mobileRoleNav}>
            <RoleSwitcherPills compact />
          </View>
        )}

        <View style={styles.mobileTitleBar}>
          <View style={styles.mobileTitleLeft}>
            <MaterialIcons name="group" size={20} color={COLORS.primary} />
            <Text variant="headlineSm" style={styles.mobileMainTitle}>
              User Management
            </Text>
          </View>

          <Pressable
            onPress={() => {
              logout();
              router.replace("/login" as any);
            }}
            style={({ pressed }: any) => [
              styles.mobileIconBtn,
              pressed && styles.pressed,
            ]}
            accessibilityLabel="Sign out"
          >
            <MaterialIcons
              name="logout"
              size={16}
              color={COLORS.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        style={styles.mobileScroll}
        contentContainerStyle={[
          styles.mobileScrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 72 },
        ]}
      >
        <UserManagementEmbed isDesktop={false} />
      </ScrollView>

      {/* Sticky Bottom Navigation Bar */}
      <OwnerMobileBottomNav activeTab="users" onTabChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Desktop
  desktopContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  desktopTopHeader: {
    height: SPACING.headerHeight,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.spaceXl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      web: {
        position: "sticky" as any,
        top: 0,
        zIndex: 30,
      },
    }),
  },
  desktopHeaderLeft: {
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
  ownerNavLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.xs,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  activeNavLinkItem: {
    backgroundColor: "rgba(32, 138, 239, 0.08)",
  },
  navText: {
    fontWeight: "500",
    fontSize: 12,
  },
  activeNavText: {
    fontWeight: "700",
    fontSize: 12,
    color: COLORS.primary,
  },
  desktopRoleCenter: {
    width: 340,
    marginHorizontal: SPACING.spaceBase,
    alignItems: "center",
    justifyContent: "center",
  },
  desktopHeaderRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceSm + 4,
  },
  hubIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  hubDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
  },
  profileBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitials: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontSize: 11,
  },
  desktopScroll: {
    flex: 1,
  },
  desktopScrollContent: {
    paddingBottom: SPACING.space3xl,
  },
  desktopMaxContainer: {
    maxWidth: 1280,
    width: "100%",
    marginHorizontal: "auto",
    padding: SPACING.spaceXl,
    gap: SPACING.spaceXl,
  },

  // Mobile
  mobileContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mobileHeader: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.spaceBase,
    paddingBottom: SPACING.spaceSm + 2,
  },
  mobileRoleNav: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.spaceSm,
  },
  mobileTitleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mobileTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mobileMainTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  mobileIconBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  mobileScroll: {
    flex: 1,
  },
  mobileScrollContent: {
    padding: SPACING.spaceBase,
    gap: SPACING.spaceLg,
  },
  pressed: {
    opacity: 0.7,
  },
});
