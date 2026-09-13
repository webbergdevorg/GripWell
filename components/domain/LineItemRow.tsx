/**
 * Gripwell - Domain Component: LineItemRow
 * Line item pricing and calibration row from Stitch.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { SPACING } from "../../constants/spacing";
import { LineItem } from "../../types/models";
import { formatINR } from "../../utils/currency";
import { Text } from "../ui/Text";
import { TextInput } from "../ui/TextInput";

export interface LineItemRowProps {
  item: LineItem;
  onChangeQty: (newQty: number) => void;
  onChangePrice: (newPrice: number) => void;
  onDelete: () => void;
  isMobile?: boolean;
}

export const LineItemRow: React.FC<LineItemRowProps> = ({
  item,
  onChangeQty,
  onChangePrice,
  onDelete,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <View style={styles.mobileCard}>
        <View style={styles.mobileTop}>
          <View style={styles.mobileDescWrap}>
            <Text variant="bodyMd" style={styles.itemTitle}>
              {item.description}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.itemSku}
            >
              SKU: {item.sku}
            </Text>
          </View>
          <Pressable onPress={onDelete} style={styles.deleteBtn}>
            <MaterialIcons name="close" size={16} color={COLORS.textMuted} />
          </Pressable>
        </View>

        <View style={styles.mobileInputs}>
          <View style={styles.mobileField}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.fieldLabel}
            >
              Quantity
            </Text>
            <TextInput
              size="sm"
              value={String(item.quantity)}
              onChangeText={(txt) => onChangeQty(parseInt(txt, 10) || 0)}
              keyboardType="numeric"
              mono
            />
          </View>

          <View style={styles.mobileField}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.fieldLabel}
            >
              Unit Price (₹)
            </Text>
            <TextInput
              size="sm"
              prefix="₹"
              value={String(item.unitPrice)}
              onChangeText={(txt) => onChangePrice(parseFloat(txt) || 0)}
              keyboardType="numeric"
              mono
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.desktopRow}>
      {/* Description */}
      <View style={styles.colDesc}>
        <Text variant="bodyMd" style={styles.itemTitle}>
          {item.description}
        </Text>
        <Text variant="bodySm" color={COLORS.textMuted} style={styles.itemSku}>
          SKU: {item.sku}
        </Text>
      </View>

      {/* Quantity */}
      <View style={styles.colQty}>
        <TextInput
          size="sm"
          value={String(item.quantity)}
          onChangeText={(txt) => onChangeQty(parseInt(txt, 10) || 0)}
          keyboardType="numeric"
          align="right"
          mono
          containerStyle={styles.qtyInput}
        />
      </View>

      {/* Unit Price */}
      <View style={styles.colPrice}>
        <TextInput
          size="sm"
          value={String(item.unitPrice)}
          onChangeText={(txt) => onChangePrice(parseFloat(txt) || 0)}
          keyboardType="numeric"
          align="right"
          mono
          containerStyle={styles.priceInput}
        />
      </View>

      {/* Line Total */}
      <View style={styles.colTotal}>
        <Text variant="tabularData" style={styles.totalText}>
          {formatINR(item.total)}
        </Text>
      </View>

      {/* Delete Action */}
      <View style={styles.colDelete}>
        <Pressable
          onPress={onDelete}
          style={({ pressed }: any) => [
            styles.deleteAction,
            pressed && styles.deleteActionPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Delete item"
        >
          <MaterialIcons name="delete" size={16} color="#CBD5E1" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.spaceSm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  colDesc: {
    flex: 1,
  },
  colQty: {
    width: 80,
    paddingHorizontal: 6,
  },
  qtyInput: {
    height: 28,
  },
  colPrice: {
    width: 100,
    paddingHorizontal: 6,
  },
  priceInput: {
    height: 28,
  },
  colTotal: {
    width: 110,
    alignItems: "flex-end",
    paddingRight: SPACING.spaceSm,
  },
  colDelete: {
    width: 32,
    alignItems: "center",
  },
  itemTitle: {
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  itemSku: {
    fontSize: 11,
    marginTop: 1,
  },
  totalText: {
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  deleteAction: {
    padding: 4,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  deleteActionPressed: {
    opacity: 0.6,
  },
  mobileCard: {
    paddingVertical: SPACING.spaceSm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    gap: SPACING.spaceSm,
  },
  mobileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  mobileDescWrap: {
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  mobileInputs: {
    flexDirection: "row",
    gap: SPACING.spaceMd,
  },
  mobileField: {
    flex: 1,
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
});
