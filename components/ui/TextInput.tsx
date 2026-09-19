/**
 * Gripwell - UI Primitive: TextInput
 */

import React, { useState } from "react";
import {
  Platform,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { TYPOGRAPHY } from "../../constants/typography";
import { Text } from "./Text";

export interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  prefix?: string;
  size?: "sm" | "md";
  align?: "left" | "right";
  mono?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  prefix,
  size = "md",
  align = "left",
  mono = false,
  containerStyle,
  inputStyle,
  error = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        styles[size],
        isFocused && styles.focused,
        error && styles.error,
        containerStyle,
      ]}
    >
      {prefix ? (
        <Text variant="labelSm" color={COLORS.textMuted} style={styles.prefix}>
          {prefix}
        </Text>
      ) : null}
      <RNTextInput
        style={[
          styles.input,
          mono ? TYPOGRAPHY.tabularMono : TYPOGRAPHY.bodyMd,
          align === "right" && styles.alignRight,
          inputStyle,
        ]}
        placeholderTextColor={COLORS.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceSm + 2,
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
        transitionProperty: "border-color, box-shadow",
        transitionDuration: "150ms",
      },
    }),
  },
  sm: {
    height: 30,
  },
  md: {
    height: 36,
  },
  focused: {
    borderColor: COLORS.borderFocus,
    ...Platform.select({
      web: {
        boxShadow: "0 0 0 1px #0F172A",
      },
    }),
  },
  error: {
    borderColor: COLORS.statusOverdueFill,
  },
  prefix: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: "100%",
    color: COLORS.textPrimary,
    padding: 0,
    margin: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
      },
    }),
  },
  alignRight: {
    textAlign: "right",
  },
});
