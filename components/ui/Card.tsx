/**
 * Gripwell - UI Primitive: Card
 */

import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SHADOWS, SPACING } from "../../constants/spacing";

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof SPACING | number;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = "spaceBase",
  elevated = false,
}) => {
  const paddingValue = typeof padding === "number" ? padding : SPACING[padding];

  return (
    <View
      style={[
        styles.card,
        { padding: paddingValue },
        elevated && SHADOWS.xs,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
  },
});
