/**
 * Gripwell - UI Primitive: Badge
 */

import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { ConsignmentStatus } from "../../types/models";
import { Text } from "./Text";

export type BadgeVariant =
  | ConsignmentStatus
  | "paid"
  | "settled"
  | "calibrating"
  | "pending"
  | "waiting"
  | "uncalibrated"
  | "credit"
  | "overdue"
  | "ready_for_seal"
  | "default"
  | "neutral";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "neutral",
  style,
}) => {
  const badgeConfig = BADGE_STYLES[variant] || BADGE_STYLES.neutral;

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: badgeConfig.bg,
          borderColor: badgeConfig.border,
        },
        style,
      ]}
    >
      <Text
        variant="labelSm"
        style={[styles.text, { color: badgeConfig.text }]}
      >
        {label}
      </Text>
    </View>
  );
};

const BADGE_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  settled: {
    bg: COLORS.statusPaidBg,
    text: COLORS.statusPaidText,
    border: COLORS.statusPaidBorder,
  },
  paid: {
    bg: COLORS.statusPaidBg,
    text: COLORS.statusPaidText,
    border: COLORS.statusPaidBorder,
  },
  calibrating: {
    bg: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.border,
  },
  pending: {
    bg: COLORS.statusPendingBg,
    text: COLORS.statusPendingText,
    border: COLORS.statusPendingBorder,
  },
  waiting: {
    bg: COLORS.statusPendingBg,
    text: COLORS.statusPendingText,
    border: COLORS.statusPendingBorder,
  },
  uncalibrated: {
    bg: COLORS.surfaceSecondary,
    text: COLORS.textMuted,
    border: COLORS.borderSubtle,
  },
  credit: {
    bg: COLORS.statusCreditBg,
    text: COLORS.statusCreditText,
    border: COLORS.statusCreditBorder,
  },
  overdue: {
    bg: COLORS.statusOverdueBg,
    text: COLORS.statusOverdueText,
    border: COLORS.statusOverdueBorder,
  },
  staging: {
    bg: "#F4F4F5",
    text: "#52525B",
    border: "#E4E4E7",
  },
  ready_for_seal: {
    bg: "#EFF6FF",
    text: "#2563EB",
    border: "#DBEAFE",
  },
  neutral: {
    bg: COLORS.surfaceSecondary,
    text: COLORS.textSecondary,
    border: COLORS.border,
  },
};

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.spaceXs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
});
