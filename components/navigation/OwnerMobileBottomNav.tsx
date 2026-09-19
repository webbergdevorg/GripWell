/**
 * Gripwell - Navigation: OwnerMobileBottomNav
 * Stable, prop-driven bottom navigation bar for Owner screens.
 * 3 items: Dashboard | Products | Users.
 * Active state derived strictly from activeTab prop.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { Text } from "../ui/Text";

export type OwnerTab = "dashboard" | "products" | "users";

interface OwnerMobileBottomNavProps {
  activeTab: OwnerTab;
  onTabChange: (tab: OwnerTab) => void;
}

const TABS: { id: OwnerTab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "products", label: "Products", icon: "inventory-2" },
  { id: "users", label: "Users", icon: "group" },
];

export const OwnerMobileBottomNav: React.FC<OwnerMobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => {
                if (!isActive) onTabChange(tab.id);
              }}
              style={({ pressed }: any) => [
                styles.tabItem,
                isActive && styles.tabItemActive,
                pressed && styles.pressed,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <MaterialIcons
                name={tab.icon as any}
                size={22}
                color={isActive ? COLORS.primary : COLORS.textMuted}
              />
              <Text
                variant="labelSm"
                color={isActive ? COLORS.textPrimary : COLORS.textMuted}
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: SPACING.spaceMd,
  },
  tabItem: {
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
        transitionProperty: "opacity",
        transitionDuration: "150ms",
      },
    }),
  },
  tabItemActive: {
    backgroundColor: "rgba(32, 138, 239, 0.08)",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  tabLabelActive: {
    fontWeight: "700",
    color: COLORS.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});
