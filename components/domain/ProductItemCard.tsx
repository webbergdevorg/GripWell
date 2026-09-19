/**
 * Gripwell - Domain Component: ProductItemCard
 * Renders an individual product SKU pricing card with 3-tier rates:
 * - Default Price
 * - Default+ Price
 * - Minimum Threshold Price
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
  onUpdateRate: (
    productId: string,
    newRate: number,
    newDefaultPlus?: number,
    newMinThreshold?: number,
  ) => void;
  onQuickAdjustStock?: (productId: string, delta: number) => void;
  isDesktop?: boolean;
}

export const ProductItemCard: React.FC<ProductItemCardProps> = ({
  product,
  onUpdateRate,
  isDesktop = false,
}) => {
  const [isEditingRate, setIsEditingRate] = useState(false);

  const defaultPrice = product.defaultBaseRate;
  const defaultPlusPrice =
    product.defaultPlusRate ?? Math.round(product.defaultBaseRate * 1.12);
  const minThresholdPrice =
    product.minThresholdRate ?? Math.round(product.defaultBaseRate * 0.9);

  const [tempDefault, setTempDefault] = useState(defaultPrice.toFixed(2));
  const [tempDefaultPlus, setTempDefaultPlus] = useState(
    defaultPlusPrice.toFixed(2),
  );
  const [tempMinThreshold, setTempMinThreshold] = useState(
    minThresholdPrice.toFixed(2),
  );

  const unit = product.unitMetric === "pcs" ? "pc" : product.unitMetric;

  const handleStartEdit = () => {
    setTempDefault(defaultPrice.toFixed(2));
    setTempDefaultPlus(defaultPlusPrice.toFixed(2));
    setTempMinThreshold(minThresholdPrice.toFixed(2));
    setIsEditingRate(true);
  };

  const handleSaveRate = () => {
    const numDef = parseFloat(tempDefault);
    const numPlus = parseFloat(tempDefaultPlus);
    const numMin = parseFloat(tempMinThreshold);

    if (!isNaN(numDef) && numDef > 0) {
      const finalPlus =
        !isNaN(numPlus) && numPlus > 0 ? numPlus : numDef * 1.12;
      const finalMin = !isNaN(numMin) && numMin > 0 ? numMin : numDef * 0.9;
      onUpdateRate(product.id, numDef, finalPlus, finalMin);
      setIsEditingRate(false);
    }
    const finalDef = !isNaN(numDef) && numDef > 0 ? numDef : defaultPrice;
    const finalPlus =
      !isNaN(numPlus) && numPlus > 0 ? numPlus : defaultPlusPrice;
    const finalMin = !isNaN(numMin) && numMin > 0 ? numMin : minThresholdPrice;

    onUpdateRate(product.id, finalDef, finalPlus, finalMin);
    setIsEditingRate(false);
  };

  const handleCancelEdit = () => {
    setTempDefault(defaultPrice.toFixed(2));
    setTempDefaultPlus(defaultPlusPrice.toFixed(2));
    setTempMinThreshold(minThresholdPrice.toFixed(2));
    setIsEditingRate(false);
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
        <View style={styles.activeBadge}>
          <Text variant="labelSm" style={styles.activeBadgeText}>
            {product.status || "ACTIVE"}
          </Text>
        </View>
      </View>

      {/* 3-Tier Pricing Details Panel */}
      {!isEditingRate ? (
        <View style={styles.pricingPanel}>
          {/* 1. Default Price */}
          <View style={styles.pricingCol}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.colLabel}
            >
              Default Price
            </Text>
            <Text variant="tabularData" style={styles.rateValue}>
              ₹{defaultPrice.toFixed(2)}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.unitSub}
            >
              per {unit}
            </Text>
          </View>

          <View style={styles.colDivider} />

          {/* 2. Default+ Price */}
          <View style={styles.pricingCol}>
            <View style={styles.plusLabelRow}>
              <Text
                variant="labelSm"
                color={COLORS.primary}
                style={[styles.colLabel, styles.plusColLabel]}
              >
                Default+ Price
              </Text>
            </View>
            <Text
              variant="tabularData"
              style={[styles.rateValue, styles.plusRateValue]}
            >
              ₹{defaultPlusPrice.toFixed(2)}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.unitSub}
            >
              premium / credit
            </Text>
          </View>

          <View style={styles.colDivider} />

          {/* 3. Minimum Threshold Price */}
          <View style={styles.pricingCol}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.colLabel}
            >
              Min Threshold
            </Text>
            <Text
              variant="tabularData"
              style={[styles.rateValue, styles.minRateValue]}
            >
              ₹{minThresholdPrice.toFixed(2)}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.unitSub}
            >
              floor rate
            </Text>
          </View>
        </View>
      ) : (
        /* Edit Mode: 3 Inputs */
        <View style={styles.editPanel}>
          <Text
            variant="labelSm"
            color={COLORS.textSecondary}
            style={styles.editPanelTitle}
          >
            Update Pricing Tiers (₹ / {unit})
          </Text>

          <View style={styles.editInputsGrid}>
            <View style={styles.editField}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.inputFieldLabel}
              >
                Default Price
              </Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <RNTextInput
                  value={tempDefault}
                  onChangeText={setTempDefault}
                  keyboardType="numeric"
                  style={styles.rateInput}
                />
              </View>
            </View>

            <View style={styles.editField}>
              <Text
                variant="labelSm"
                color={COLORS.primary}
                style={styles.inputFieldLabel}
              >
                Default+ Price
              </Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <RNTextInput
                  value={tempDefaultPlus}
                  onChangeText={setTempDefaultPlus}
                  keyboardType="numeric"
                  style={styles.rateInput}
                />
              </View>
            </View>

            <View style={styles.editField}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.inputFieldLabel}
              >
                Min Threshold
              </Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencyPrefix}>₹</Text>
                <RNTextInput
                  value={tempMinThreshold}
                  onChangeText={setTempMinThreshold}
                  keyboardType="numeric"
                  style={styles.rateInput}
                />
              </View>
            </View>
          </View>

          <View style={styles.editActionsRow}>
            <Pressable
              onPress={handleCancelEdit}
              style={styles.cancelBtn}
              accessibilityRole="button"
            >
              <MaterialIcons
                name="close"
                size={14}
                color={COLORS.textSecondary}
              />
              <Text variant="labelSm" color={COLORS.textSecondary}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSaveRate}
              style={styles.saveBtn}
              accessibilityRole="button"
            >
              <MaterialIcons name="check" size={14} color="#FFFFFF" />
              <Text variant="labelSm" style={styles.saveBtnText}>
                Save Pricing
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Bottom Actions Row */}
      {!isEditingRate && (
        <View style={styles.bottomActions}>
          <Pressable
            onPress={handleStartEdit}
            style={({ pressed }: any) => [
              styles.actionBtn,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
          >
            <MaterialIcons
              name="edit"
              size={14}
              color={COLORS.textPrimary}
              style={{ marginRight: 4 }}
            />
            <Text variant="labelMd" style={styles.actionBtnText}>
              Edit Pricing
            </Text>
          </Pressable>
        </View>
      )}
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

  // 3-Tier Pricing Panel
  pricingPanel: {
    marginTop: SPACING.spaceSm + 2,
    backgroundColor: "#F8FAFC",
    paddingVertical: SPACING.spaceSm + 2,
    paddingHorizontal: SPACING.spaceSm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    flexDirection: "row",
    alignItems: "center",
  },
  pricingCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  colDivider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
  },
  colLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  plusLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  plusColLabel: {
    color: COLORS.primary,
  },
  rateValue: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  plusRateValue: {
    color: COLORS.primary,
  },
  minRateValue: {
    color: COLORS.statusOverdueText,
  },
  unitSub: {
    fontSize: 10,
    marginTop: 1,
  },

  // Edit Mode Panel
  editPanel: {
    marginTop: SPACING.spaceSm + 2,
    backgroundColor: "#F8FAFC",
    padding: SPACING.spaceSm + 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: SPACING.spaceSm,
  },
  editPanelTitle: {
    fontSize: 11,
    fontWeight: "600",
  },
  editInputsGrid: {
    flexDirection: "row",
    gap: SPACING.spaceSm,
  },
  editField: {
    flex: 1,
    gap: 3,
  },
  inputFieldLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 6,
  },
  currencyPrefix: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginRight: 2,
    fontWeight: "600",
  },
  rateInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
    padding: 0,
    ...Platform.select({
      web: { outlineStyle: "none" as any },
    }),
  },
  editActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceSm,
    marginTop: 2,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 28,
    paddingHorizontal: SPACING.spaceSm,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    ...Platform.select({ web: { cursor: "pointer" } }),
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 28,
    paddingHorizontal: SPACING.spaceSm + 4,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.primary,
    ...Platform.select({ web: { cursor: "pointer" } }),
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 11,
  },

  // Bottom Actions Row
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: SPACING.spaceSm,
  },
  actionBtn: {
    height: 30,
    paddingHorizontal: SPACING.spaceSm + 4,
    borderRadius: RADIUS.xs,
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
  actionBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  pressed: {
    opacity: 0.8,
  },
});
