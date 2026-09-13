/**
 * Gripwell - Mobile Supervisor Header
 * Stitch Mobile Reference: cc0a7d9be25f4b6fa0ea9a227bcb3f76
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { SPACING } from "../../constants/spacing";
import { Text } from "../ui/Text";
import { RoleSwitcherPills } from "./RoleSwitcherPills";

interface MobileSupervisorHeaderProps {
  dockName?: string;
}

export const MobileSupervisorHeader: React.FC<MobileSupervisorHeaderProps> = ({
  dockName = "Dock Bay 3",
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) }]}
    >
      {/* Top Role Switcher Row */}
      <View style={styles.roleNavRow}>
        <RoleSwitcherPills compact />
      </View>

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

        {/* Right: Rates Masked Badge */}
        <View style={styles.rightSection}>
          <MaterialIcons
            name="visibility-off"
            size={15}
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
    gap: 4,
  },
  maskedText: {
    fontSize: 12,
  },
});
