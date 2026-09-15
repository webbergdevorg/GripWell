/**
 * Gripwell - Form: PaymentModeSelector
 * Multi-mode payment selector from Stitch.
 */

import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { PaymentMode } from "../../types/models";
import { Text } from "../ui/Text";

export interface PaymentModeSelectorProps {
  selectedMode: PaymentMode;
  onSelectMode: (mode: PaymentMode) => void;
  isMobile?: boolean;
}

export const PaymentModeSelector: React.FC<PaymentModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  isMobile = false,
}) => {
  const desktopOptions: { id: PaymentMode; label: string }[] = [
    { id: "cash", label: "Cash" },
    { id: "upi", label: "UPI" },
    { id: "credit", label: "Credit (Net-15)" },
    { id: "bank_transfer", label: "Bank Transfer" },
  ];

  const mobileOptions: { id: PaymentMode; label: string }[] = [
    { id: "cash", label: "Cash" },
    { id: "upi", label: "UPI / NEFT" },
    { id: "credit", label: "Credit" },
  ];

  const options = isMobile ? mobileOptions : desktopOptions;

  if (isMobile) {
    return (
      <View style={styles.mobileContainer}>
        {options.map((opt) => {
          const isSelected = selectedMode === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelectMode(opt.id)}
              style={[
                styles.mobileOption,
                isSelected && styles.mobileOptionSelected,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                variant="labelSm"
                style={[
                  styles.mobileOptionText,
                  isSelected && styles.mobileOptionTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.desktopContainer}>
      {options.map((opt) => {
        const isSelected = selectedMode === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelectMode(opt.id)}
            style={({ pressed }: any) => [
              styles.desktopOption,
              isSelected
                ? styles.desktopOptionSelected
                : styles.desktopOptionUnselected,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              variant="labelSm"
              style={[
                styles.desktopOptionText,
                isSelected && styles.desktopOptionTextSelected,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flexDirection: "row",
    gap: SPACING.spaceSm,
  },
  desktopOption: {
    flex: 1,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: "pointer",
        userSelect: "none",
        transitionProperty: "background-color, border-color, color",
        transitionDuration: "150ms",
      },
    }),
  },
  desktopOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  desktopOptionUnselected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  desktopOptionText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  desktopOptionTextSelected: {
    color: COLORS.onPrimary,
    fontWeight: "600",
  },
  mobileContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 4,
  },
  mobileOption: {
    flex: 1,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.sm,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  mobileOptionSelected: {
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      web: {
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
    }),
  },
  mobileOptionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  mobileOptionTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});
