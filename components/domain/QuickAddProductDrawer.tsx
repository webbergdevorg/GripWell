/**
 * Gripwell - Domain Component: QuickAddProductDrawer
 * Collapsible quick-add panel for new SKU master catalog entries (#quickAddDrawer).
 * Matches Stitch Screen 7 specifications.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
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

export interface QuickAddProductDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSaveProduct: (newProduct: ProductSKU) => void;
  isDesktop?: boolean;
}

const CATEGORY_OPTIONS = [
  "Industrial Crates",
  "Furniture & Seating",
  "Agro Products",
  "Packaging & Drums",
];

const UNIT_OPTIONS = [
  { label: "pcs (Units)", value: "pcs" },
  { label: "kg (Kilograms)", value: "kg" },
  { label: "L (Liters)", value: "L" },
  { label: "bags (Bulk)", value: "bags" },
  { label: "drums (Heavy)", value: "drums" },
];

export const QuickAddProductDrawer: React.FC<QuickAddProductDrawerProps> = ({
  visible,
  onClose,
  onSaveProduct,
  isDesktop = false,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Industrial Crates");
  const [unitMetric, setUnitMetric] = useState("pcs");
  const [rate, setRate] = useState("");
  const [hsnCode, setHsnCode] = useState("");

  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [unitPickerOpen, setUnitPickerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!visible) return null;

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMessage("Product title is required.");
      return;
    }
    const numRate = parseFloat(rate);
    if (isNaN(numRate) || numRate <= 0) {
      setErrorMessage("Please enter a valid base rate.");
      return;
    }

    const randomSkuNum = Math.floor(100 + Math.random() * 900);
    const skuCode = `#PRD-${randomSkuNum}`;

    let categoryTag = "General";
    if (category.includes("Crates")) categoryTag = "Industrial";
    else if (category.includes("Seating") || category.includes("Furniture"))
      categoryTag = "Furniture";
    else if (category.includes("Agro")) categoryTag = "Agro";
    else if (category.includes("Packaging")) categoryTag = "Packaging";

    const newSKU: ProductSKU = {
      id: `PRD-${randomSkuNum}`,
      sku: skuCode,
      name: title.trim(),
      category: category,
      categoryTag: categoryTag,
      status: "ACTIVE",
      unitMetric: unitMetric,
      defaultBaseRate: numRate,
      rateDisplay: `₹${numRate.toFixed(2)} / ${unitMetric === "pcs" ? "pc" : unitMetric}`,
      warehouseStock: 100,
      warehouseStockDisplay: `100 ${unitMetric}`,
      stockSubtext: "(Initial batch)",
      hsnCode: hsnCode.trim() || "3923.10",
    };

    onSaveProduct(newSKU);
    // Reset form
    setTitle("");
    setRate("");
    setHsnCode("");
    setErrorMessage(null);
    onClose();
  };

  const handleDiscard = () => {
    setTitle("");
    setRate("");
    setHsnCode("");
    setErrorMessage(null);
    onClose();
  };

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      {/* Drawer Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <MaterialIcons
            name="inventory-2"
            size={18}
            color={COLORS.secondary}
          />
          <Text variant="headlineSm" style={styles.headerTitle}>
            New SKU Master Entry
          </Text>
        </View>
        <Pressable
          onPress={handleDiscard}
          style={styles.closeBtn}
          accessibilityLabel="Close quick add drawer"
        >
          <MaterialIcons name="close" size={16} color={COLORS.textSecondary} />
        </Pressable>
      </View>

      {/* Error Banner */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <MaterialIcons name="error-outline" size={14} color="#DC2626" />
          <Text variant="bodySm" style={styles.errorText}>
            {errorMessage}
          </Text>
        </View>
      )}

      {/* Form Fields Grid */}
      <View style={styles.formGrid}>
        {/* Product Title (Full Width) */}
        <View style={styles.fieldFull}>
          <Text
            variant="labelSm"
            color={COLORS.textSecondary}
            style={styles.label}
          >
            Product Title
          </Text>
          <RNTextInput
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="e.g. Molded Pallet 1200x1000"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
          />
        </View>

        {/* Category Selector */}
        <View style={styles.fieldHalf}>
          <Text
            variant="labelSm"
            color={COLORS.textSecondary}
            style={styles.label}
          >
            Category
          </Text>
          {Platform.OS === "web" ? (
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              style={webSelectStyle as any}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <Pressable
              onPress={() => setCategoryPickerOpen(true)}
              style={styles.selectorTrigger}
            >
              <Text
                variant="bodyMd"
                style={styles.selectorValue}
                numberOfLines={1}
              >
                {category}
              </Text>
              <MaterialIcons
                name="arrow-drop-down"
                size={18}
                color={COLORS.textSecondary}
              />
            </Pressable>
          )}
        </View>

        {/* Unit Metric Selector */}
        <View style={styles.fieldHalf}>
          <Text
            variant="labelSm"
            color={COLORS.textSecondary}
            style={styles.label}
          >
            Unit Metric
          </Text>
          {Platform.OS === "web" ? (
            <select
              value={unitMetric}
              onChange={(e: any) => setUnitMetric(e.target.value)}
              style={webSelectStyle as any}
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          ) : (
            <Pressable
              onPress={() => setUnitPickerOpen(true)}
              style={styles.selectorTrigger}
            >
              <Text variant="bodyMd" style={styles.selectorValue}>
                {UNIT_OPTIONS.find((u) => u.value === unitMetric)?.label ||
                  unitMetric}
              </Text>
              <MaterialIcons
                name="arrow-drop-down"
                size={18}
                color={COLORS.textSecondary}
              />
            </Pressable>
          )}
        </View>

        {/* Default Base Rate (₹) */}
        <View style={styles.fieldHalf}>
          <Text
            variant="labelSm"
            color={COLORS.textSecondary}
            style={styles.label}
          >
            Default Base Rate (₹)
          </Text>
          <RNTextInput
            value={rate}
            onChangeText={(r) => {
              setRate(r);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="240.00"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* HSN / GST Code */}
        <View style={styles.fieldHalf}>
          <Text
            variant="labelSm"
            color={COLORS.textSecondary}
            style={styles.label}
          >
            HSN / GST Code
          </Text>
          <RNTextInput
            value={hsnCode}
            onChangeText={setHsnCode}
            placeholder="3923.10"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={handleSave}
          style={({ pressed }: any) => [
            styles.saveBtn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
        >
          <MaterialIcons name="check-circle" size={16} color="#FFFFFF" />
          <Text variant="labelMd" style={styles.saveBtnText}>
            Save SKU to Master
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDiscard}
          style={({ pressed }: any) => [
            styles.discardBtn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
        >
          <Text variant="labelMd" style={styles.discardBtnText}>
            Discard
          </Text>
        </Pressable>
      </View>

      {/* Native Category Modal */}
      {Platform.OS !== "web" && (
        <Modal
          visible={categoryPickerOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setCategoryPickerOpen(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setCategoryPickerOpen(false)}
          >
            <View style={styles.modalSheet}>
              <Text variant="headlineSm" style={{ marginBottom: 12 }}>
                Select Category
              </Text>
              {CATEGORY_OPTIONS.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    setCategoryPickerOpen(false);
                  }}
                  style={styles.modalOption}
                >
                  <Text
                    variant="bodyMd"
                    style={{
                      color:
                        category === cat
                          ? COLORS.secondary
                          : COLORS.textPrimary,
                      fontWeight: category === cat ? "600" : "400",
                    }}
                  >
                    {cat}
                  </Text>
                  {category === cat && (
                    <MaterialIcons
                      name="check"
                      size={16}
                      color={COLORS.secondary}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Native Unit Modal */}
      {Platform.OS !== "web" && (
        <Modal
          visible={unitPickerOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setUnitPickerOpen(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setUnitPickerOpen(false)}
          >
            <View style={styles.modalSheet}>
              <Text variant="headlineSm" style={{ marginBottom: 12 }}>
                Select Unit Metric
              </Text>
              {UNIT_OPTIONS.map((u) => (
                <Pressable
                  key={u.value}
                  onPress={() => {
                    setUnitMetric(u.value);
                    setUnitPickerOpen(false);
                  }}
                  style={styles.modalOption}
                >
                  <Text
                    variant="bodyMd"
                    style={{
                      color:
                        unitMetric === u.value
                          ? COLORS.secondary
                          : COLORS.textPrimary,
                      fontWeight: unitMetric === u.value ? "600" : "400",
                    }}
                  >
                    {u.label}
                  </Text>
                  {unitMetric === u.value && (
                    <MaterialIcons
                      name="check"
                      size={16}
                      color={COLORS.secondary}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const webSelectStyle = {
  height: 36,
  paddingLeft: 8,
  paddingRight: 8,
  borderRadius: 8,
  backgroundColor: "#F1F5F9",
  borderWidth: 1,
  borderColor: "#E2E8F0",
  fontSize: 13,
  color: "#0F172A",
  outline: "none",
  width: "100%",
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: SPACING.spaceBase,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.spaceBase,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      },
      default: {
        elevation: 2,
      },
    }),
  },
  desktopContainer: {
    marginBottom: SPACING.spaceLg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: SPACING.spaceXs + 2,
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceXs + 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    padding: 8,
    borderRadius: RADIUS.xs,
    marginBottom: 8,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.spaceSm,
    marginTop: 4,
  },
  fieldFull: {
    width: "100%",
  },
  fieldHalf: {
    flex: 1,
    minWidth: 130,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    height: 36,
    paddingHorizontal: SPACING.spaceSm + 2,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  selectorTrigger: {
    height: 36,
    paddingHorizontal: SPACING.spaceSm,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    paddingTop: SPACING.spaceSm + 4,
  },
  saveBtn: {
    flex: 1,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...Platform.select({
      web: {
        cursor: "pointer",
        transitionProperty: "background-color",
        transitionDuration: "150ms",
      },
    }),
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  discardBtn: {
    height: 36,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  discardBtnText: {
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.85,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.md,
    padding: 20,
    width: "100%",
    maxWidth: 340,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
});
