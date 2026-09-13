/**
 * Gripwell - Domain Component: ProductItemCard
 * Renders an individual product SKU inventory & pricing card.
 * Matches Google Stitch Screen 7 specifications exactly.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Platform,
    Pressable,
    TextInput as RNTextInput,
    StyleSheet,
    View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { ProductSKU } from "../../types/models";
import { Text } from "../ui/Text";

export interface ProductItemCardProps {
  product: ProductSKU;
  onUpdateRate: (productId: string, newRate: number) => void;
  onQuickAdjustStock: (productId: string, delta: number) => void;
  isDesktop?: boolean;
}

export const ProductItemCard: React.FC<ProductItemCardProps> = ({
  product,
  onUpdateRate,
  onQuickAdjustStock,
  isDesktop = false,
}) => {
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState(product.defaultBaseRate.toFixed(2));
  const [quickAdjustVisible, setQuickAdjustVisible] = useState(false);

  const handleSaveRate = () => {
    const num = parseFloat(tempRate);
    if (!isNaN(num) && num > 0) {
      onUpdateRate(product.id, num);
      setIsEditingRate(false);
    }
  };

  return (
    <View style={[styles.card, isDesktop && styles.desktopCard]}>
      {/* Top Title & SKU Row */}
      <View style={styles.topRow}>
        <View style={styles.titleColumn}>
          <View style={styles.titleBadgeRow}>
            <Text variant="headlineSm" style={styles.productName}>
              {product.name}
            </Text>
            <View style={styles.categoryChip}>
              <Text variant="labelSm" style={styles.categoryChipText}>
                {product.categoryTag}
              </Text>
            </View>
          </View>
          <Text variant="labelSm" style={styles.skuText}>
            SKU: {product.sku}
          </Text>
        </View>

        {/* Status Badge */}
        {product.isLowStock ? (
          <View style={styles.lowStockBadge}>
            <MaterialIcons
              name="warning"
              size={12}
              color="#DC2626"
              style={{ marginRight: 3 }}
            />
            <Text variant="labelSm" style={styles.lowStockText}>
              LOW STOCK
            </Text>
          </View>
        ) : (
          <View style={styles.activeBadge}>
            <Text variant="labelSm" style={styles.activeBadgeText}>
              {product.status}
            </Text>
          </View>
        )}
      </View>

      {/* Pricing & Stock Details Panel */}
      <View style={styles.detailsPanel}>
        {/* Left Column: Default Unit Rate */}
        <View style={styles.detailsCol}>
          <Text variant="labelSm" color={COLORS.textSecondary}>
            Default Unit Rate
          </Text>
          {isEditingRate ? (
            <View style={styles.rateEditWrapper}>
              <Text variant="tabularData" style={styles.rateCurrency}>
                ₹
              </Text>
              <RNTextInput
                value={tempRate}
                onChangeText={setTempRate}
                keyboardType="numeric"
                autoFocus
                style={styles.rateInput}
              />
              <Pressable
                onPress={handleSaveRate}
                style={styles.rateSaveBtn}
                accessibilityRole="button"
              >
                <MaterialIcons name="check" size={14} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={() => {
                  setTempRate(product.defaultBaseRate.toFixed(2));
                  setIsEditingRate(false);
                }}
                style={styles.rateCancelBtn}
                accessibilityRole="button"
              >
                <MaterialIcons
                  name="close"
                  size={14}
                  color={COLORS.textMuted}
                />
              </Pressable>
            </View>
          ) : (
            <Text variant="tabularData" style={styles.rateValue}>
              ₹{product.defaultBaseRate.toFixed(2)}{" "}
              <Text variant="bodySm" color={COLORS.textSecondary}>
                / {product.unitMetric === "pcs" ? "pc" : product.unitMetric}
              </Text>
            </Text>
          )}

          {product.secondaryRateDisplay ? (
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.secondaryRateText}
            >
              {product.secondaryRateDisplay}
            </Text>
          ) : null}
        </View>

        {/* Right Column: Current Warehouse Stock */}
        <View style={styles.detailsCol}>
          <Text variant="labelSm" color={COLORS.textSecondary}>
            Current Warehouse Stock
          </Text>
          <Text
            variant="tabularData"
            style={[
              styles.stockValue,
              product.isLowStock && styles.stockValueLow,
            ]}
          >
            {product.warehouseStockDisplay}{" "}
            {!product.isLowStock && product.stockSubtext ? (
              <Text variant="bodySm" color={COLORS.textSecondary}>
                {product.stockSubtext}
              </Text>
            ) : null}
          </Text>

          {product.isLowStock && product.stockSubtext ? (
            <Text variant="labelSm" style={styles.lowStockSubtext}>
              {product.stockSubtext}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Quick Adjust Strip (Collapsible inline) */}
      {quickAdjustVisible && (
        <View style={styles.quickAdjustStrip}>
          <Text variant="labelSm" color={COLORS.textSecondary}>
            Adjust Warehouse Stock:
          </Text>
          <View style={styles.adjustActions}>
            <Pressable
              onPress={() => onQuickAdjustStock(product.id, -10)}
              style={styles.adjustBtn}
            >
              <Text variant="labelSm" style={styles.adjustBtnText}>
                -10
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onQuickAdjustStock(product.id, +10)}
              style={styles.adjustBtn}
            >
              <Text variant="labelSm" style={styles.adjustBtnText}>
                +10
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onQuickAdjustStock(product.id, +50)}
              style={styles.adjustBtn}
            >
              <Text variant="labelSm" style={styles.adjustBtnText}>
                +50
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setQuickAdjustVisible(false)}
              style={styles.adjustCloseBtn}
            >
              <MaterialIcons name="done" size={14} color={COLORS.secondary} />
            </Pressable>
          </View>
        </View>
      )}

      {/* Bottom Actions Row */}
      <View style={styles.bottomActions}>
        <Pressable
          onPress={() => {
            setIsEditingRate(!isEditingRate);
            setTempRate(product.defaultBaseRate.toFixed(2));
          }}
          style={({ pressed }: any) => [
            styles.actionBtn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
        >
          <MaterialIcons
            name="edit"
            size={15}
            color={COLORS.textPrimary}
            style={{ marginRight: 4 }}
          />
          <Text variant="labelMd" style={styles.actionBtnText}>
            {isEditingRate ? "Done" : "Edit Rate"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setQuickAdjustVisible(!quickAdjustVisible)}
          style={({ pressed }: any) => [
            styles.actionBtn,
            pressed && styles.pressed,
            quickAdjustVisible && styles.actionBtnActive,
          ]}
          accessibilityRole="button"
        >
          <MaterialIcons
            name="sync-alt"
            size={15}
            color={quickAdjustVisible ? COLORS.secondary : COLORS.textPrimary}
            style={{ marginRight: 4 }}
          />
          <Text
            variant="labelMd"
            style={[
              styles.actionBtnText,
              quickAdjustVisible && { color: COLORS.secondary },
            ]}
          >
            Quick Adjust
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.spaceBase,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.spaceSm + 2,
    ...Platform.select({
      web: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      },
      default: {
        elevation: 1,
      },
    }),
  },
  desktopCard: {
    marginBottom: SPACING.spaceBase,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleColumn: {
    flex: 1,
    marginRight: SPACING.spaceSm,
  },
  titleBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: SPACING.spaceXs + 2,
  },
  productName: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  categoryChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    backgroundColor: "#F1F5F9",
  },
  categoryChipText: {
    fontSize: 11,
    lineHeight: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  skuText: {
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginTop: 3,
  },
  activeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    backgroundColor: "#ECFDF5",
  },
  activeBadgeText: {
    fontSize: 11,
    lineHeight: 14,
    color: "#059669",
    fontWeight: "600",
  },
  lowStockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    backgroundColor: "#FEE2E2",
  },
  lowStockText: {
    fontSize: 11,
    lineHeight: 14,
    color: "#DC2626",
    fontWeight: "600",
  },
  detailsPanel: {
    marginTop: SPACING.spaceSm + 2,
    backgroundColor: "#F8FAFC",
    padding: SPACING.spaceSm + 2,
    borderRadius: RADIUS.sm,
    flexDirection: "row",
    gap: SPACING.spaceSm,
  },
  detailsCol: {
    flex: 1,
  },
  rateValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 3,
  },
  rateEditWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  rateCurrency: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  rateInput: {
    height: 26,
    width: 65,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: RADIUS.xs,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 4,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  rateSaveBtn: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  rateCancelBtn: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.xs,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryRateText: {
    fontSize: 11,
    marginTop: 2,
  },
  stockValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 3,
  },
  stockValueLow: {
    color: "#DC2626",
  },
  lowStockSubtext: {
    fontSize: 11,
    color: "#DC2626",
    marginTop: 2,
    fontWeight: "500",
  },
  quickAdjustStrip: {
    marginTop: SPACING.spaceSm,
    padding: SPACING.spaceSm,
    backgroundColor: "#EFF6FF",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  adjustActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  adjustBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  adjustBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.secondary,
  },
  adjustCloseBtn: {
    padding: 3,
    borderRadius: RADIUS.xs,
    backgroundColor: "#DBEAFE",
    marginLeft: 4,
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceXs + 2,
    paddingTop: SPACING.spaceSm,
  },
  actionBtn: {
    height: 32,
    paddingHorizontal: SPACING.spaceSm + 2,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
        transitionProperty: "background-color",
        transitionDuration: "150ms",
      },
    }),
  },
  actionBtnActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#93C5FD",
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  pressed: {
    opacity: 0.8,
  },
});
