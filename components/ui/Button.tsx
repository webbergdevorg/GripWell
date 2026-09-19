/**
 * Gripwell - UI Primitive: Button
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { Text } from "./Text";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "destructive" | "ghost" | "success";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  title?: string;
  label?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = "primary",
  size = "md",
  title,
  label,
  icon,
  iconRight,
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const displayTitle = title || label || "";

  const renderIcon = (ic: React.ReactNode) => {
    if (!ic) return null;
    if (typeof ic === "string") {
      const iconColor =
        variant === "primary" ||
        variant === "destructive" ||
        variant === "success"
          ? "#FFFFFF"
          : COLORS.textPrimary;
      return (
        <MaterialIcons
          name={ic as any}
          size={size === "sm" ? 14 : 16}
          color={iconColor}
        />
      );
    }
    return ic;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed, hovered }: any) => [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        hovered && styles[`${variant}Hover` as keyof typeof styles],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" ||
            variant === "destructive" ||
            variant === "success"
              ? "#FFFFFF"
              : COLORS.textPrimary
          }
        />
      ) : (
        <>
          {renderIcon(icon)}
          {displayTitle ? (
            <Text
              variant={size === "sm" ? "labelSm" : "labelMd"}
              style={[
                styles.textBase,
                styles[`${variant}Text` as keyof typeof styles] as TextStyle,
                textStyle,
              ]}
            >
              {displayTitle}
            </Text>
          ) : null}
          {renderIcon(iconRight)}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.spaceXs + 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "transparent",
    ...Platform.select({
      web: {
        cursor: "pointer",
        userSelect: "none",
        transitionProperty: "background-color, border-color, transform",
        transitionDuration: "150ms",
      },
    }),
  },
  fullWidth: {
    width: "100%",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
    ...Platform.select({
      web: {
        cursor: "not-allowed",
      },
    }),
  },

  // Sizes
  sm: {
    height: 32,
    paddingHorizontal: SPACING.spaceSm + 2,
  },
  md: {
    height: 36,
    paddingHorizontal: SPACING.spaceBase,
  },
  lg: {
    height: 40,
    paddingHorizontal: SPACING.spaceLg,
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  primaryHover: {
    backgroundColor: COLORS.primaryHover,
  },
  primaryText: {
    color: COLORS.onPrimary,
    fontWeight: "500",
  },

  secondary: {
    backgroundColor: COLORS.surfaceSecondary,
    borderColor: COLORS.border,
  },
  secondaryHover: {
    backgroundColor: "#E2E8F0",
  },
  secondaryText: {
    color: COLORS.textPrimary,
    fontWeight: "500",
  },

  outline: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  outlineHover: {
    backgroundColor: COLORS.surfaceSecondary,
    borderColor: "#CBD5E1",
  },
  outlineText: {
    color: COLORS.textPrimary,
    fontWeight: "500",
  },

  destructive: {
    backgroundColor: COLORS.statusOverdueBg,
    borderColor: COLORS.statusOverdueBorder,
  },
  destructiveHover: {
    backgroundColor: "#FFE4E6",
  },
  destructiveText: {
    color: COLORS.statusOverdueFill,
    fontWeight: "500",
  },

  success: {
    backgroundColor: COLORS.statusPaidFill,
    borderColor: COLORS.statusPaidFill,
  },
  successHover: {
    backgroundColor: "#047857",
  },
  successText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },

  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  ghostHover: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  ghostText: {
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  textBase: {
    textAlign: "center",
  },
});
