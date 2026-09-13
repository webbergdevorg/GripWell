/**
 * Gripwell - UI Primitive: Text
 */

import React from "react";
import {
    Text as RNText,
    TextProps as RNTextProps,
    StyleSheet,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { TYPOGRAPHY, TypographyVariant } from "../../constants/typography";

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  tabular?: boolean;
}

export const Text: React.FC<TextProps> = ({
  variant = "bodyMd",
  color,
  tabular = false,
  style,
  children,
  ...props
}) => {
  const variantStyle = TYPOGRAPHY[variant] || TYPOGRAPHY.bodyMd;
  const textColor = color || COLORS.textPrimary;

  return (
    <RNText
      style={[
        styles.base,
        variantStyle,
        { color: textColor },
        tabular && styles.tabular,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  tabular: {
    fontVariant: ["tabular-nums"],
  },
});
