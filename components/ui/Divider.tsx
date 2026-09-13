/**
 * Gripwell - UI Primitive: Divider
 */

import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";

export interface DividerProps {
  color?: string;
  marginVertical?: number;
  style?: StyleProp<ViewStyle>;
}

export const Divider: React.FC<DividerProps> = ({
  color = COLORS.border,
  marginVertical = 0,
  style,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          marginVertical,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: "100%",
  },
});
