/**
 * Gripwell - Mobile Supervisor Header
 * Stitch Mobile Reference: cc0a7d9be25f4b6fa0ea9a227bcb3f76
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { SPACING } from "../../constants/spacing";
import { useRoleContext } from "../../hooks/useRoleContext";
import { Text } from "../ui/Text";

interface MobileSupervisorHeaderProps {
  dockName?: string;
}

export const MobileSupervisorHeader: React.FC<MobileSupervisorHeaderProps> = ({
  dockName = "Dock Bay 3",
}) => {
  const insets = useSafeAreaInsets();
  const { logout } = useRoleContext();

  return (
    <View
      style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) }]}
    >
      <View style={styles.headerContent}>
        {/* Left: Active Bay Indicator */}
        <View style={styles.leftSection}>
          <View style={styles.activeDot} />
          <Text variant="headlineSm" style={styles.dockTitle}>
            {dockName}
          </Text>
          <Text variant="bodySm" color={COLORS.borderSubtle}>
            /
          </Text>
          <Text variant="bodySm" color={COLORS.textSecondary}>
            Supervisor
          </Text>
        </View>

        {/* Right: Rates Masked Badge & Logout Button */}
        <View style={styles.rightSection}>
          <View style={styles.ratesMaskedBadge}>
            <MaterialIcons
              name="visibility-off"
              size={13}
              color={COLORS.textMuted}
            />
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.maskedText}
            >
              Rates masked
            </Text>
          </View>

          <Pressable
            onPress={() => {
              logout();
              router.replace("/login" as any);
            }}
            style={styles.logoutBtn}
            accessibilityRole="button"
            accessibilityLabel="Sign out of terminal"
          >
            <MaterialIcons
              name="logout"
              size={16}
              color={COLORS.textSecondary}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    zIndex: 50,
  },
  roleNavRow: {
    paddingHorizontal: SPACING.spaceBase,
    paddingTop: 4,
    paddingBottom: 4,
  },
  headerContent: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceBase,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.statusPaidText, // Emerald 500 (#059669)
  },
  dockTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratesMaskedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  maskedText: {
    fontSize: 12,
  },
  logoutBtn: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
