/**
 * Gripwell - Domain: ManifestTable
 * Outbound cargo manifest verification component for dock supervisors.
 * Strictly pricing-masked per ARCHITECTURE.md.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { TYPOGRAPHY } from "../../constants/typography";
import { LineItem } from "../../types/models";
import { Text } from "../ui/Text";
import { TextInput } from "../ui/TextInput";

interface ManifestTableProps {
  items: LineItem[];
  onAddItem: (item: LineItem) => void;
  onRemoveItem: (id: string) => void;
  isDesktop: boolean;
}

export const ManifestTable: React.FC<ManifestTableProps> = ({
  items,
  onAddItem,
  onRemoveItem,
  isDesktop,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemSku, setNewItemSku] = useState("");
  const [newItemQty, setNewItemQty] = useState("10");
  const [newItemPackaging, setNewItemPackaging] = useState("Standard Crate");

  const totalPieces = items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    const qty = parseInt(newItemQty, 10) || 1;
    const newItem: LineItem = {
      id: `li-${Date.now()}`,
      description: newItemName.trim(),
      sku: newItemSku.trim() || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      unit: "Units",
      quantity: qty,
      unitPrice: 0, // Masked
      total: 0, // Masked
      packaging: newItemPackaging.trim(),
      bayId: `Bay-3-${String.fromCharCode(65 + Math.floor(Math.random() * 4))}${Math.floor(10 + Math.random() * 90)}`,
    };
    onAddItem(newItem);
    setNewItemName("");
    setNewItemSku("");
    setNewItemQty("10");
    setNewItemPackaging("Standard Crate");
    setIsAdding(false);
  };

  if (isDesktop) {
    return (
      <View style={styles.container}>
        {/* Desktop Header */}
        <View style={styles.sectionHeader}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.sectionTitle}
          >
            2. PRODUCTS & QUANTITIES
          </Text>
          <Pressable
            onPress={() => setIsAdding(!isAdding)}
            style={({ pressed }: any) => [
              styles.addBtn,
              pressed && styles.pressed,
            ]}
          >
            <MaterialIcons name="add" size={14} color={COLORS.textPrimary} />
            <Text
              variant="labelSm"
              color={COLORS.textPrimary}
              style={styles.addBtnText}
            >
              Add Item
            </Text>
          </Pressable>
        </View>

        {/* Desktop Manifest Table */}
        <View style={styles.tableBorder}>
          {/* Table Head */}
          <View style={styles.tableHeadRow}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colIndex}
            >
              #
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colDesc}
            >
              Item Description
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colUnit}
            >
              Unit
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colQty}
            >
              Qty
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colPackaging}
            >
              Packaging
            </Text>
            <View style={styles.colAction} />
          </View>

          {/* Table Rows */}
          {items.map((item, idx) => (
            <View key={item.id} style={styles.tableRow}>
              <Text
                variant="tabularData"
                color={COLORS.textMuted}
                style={styles.colIndex}
              >
                {String(idx + 1).padStart(2, "0")}
              </Text>

              <View style={styles.colDesc}>
                <Text
                  variant="bodyMd"
                  color={COLORS.textPrimary}
                  style={styles.itemTitle}
                >
                  {item.description}{" "}
                  <Text
                    variant="tabularData"
                    color={COLORS.textMuted}
                    style={styles.itemSku}
                  >
                    {item.sku}
                  </Text>
                </Text>
              </View>

              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={styles.colUnit}
              >
                {item.unit}
              </Text>

              <Text
                variant="tabularData"
                color={COLORS.textPrimary}
                style={styles.colQtyText}
              >
                {item.quantity}
              </Text>

              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={styles.colPackaging}
              >
                {item.packaging || "Carton"}
              </Text>

              <View style={styles.colAction}>
                <Pressable
                  onPress={() => onRemoveItem(item.id)}
                  style={({ pressed }: any) => [
                    styles.deleteBtn,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialIcons
                    name="close"
                    size={14}
                    color={COLORS.textMuted}
                  />
                </Pressable>
              </View>
            </View>
          ))}

          {/* Inline Add Item Row */}
          {isAdding && (
            <View style={styles.addRow}>
              <View style={styles.colIndex}>
                <Text variant="tabularData" color={COLORS.textMuted}>
                  +
                </Text>
              </View>
              <View style={styles.colDescInput}>
                <TextInput
                  placeholder="Item name..."
                  value={newItemName}
                  onChangeText={setNewItemName}
                  size="sm"
                  autoFocus
                />
              </View>
              <View style={styles.colUnitInput}>
                <Text variant="bodySm" color={COLORS.textSecondary}>
                  Units
                </Text>
              </View>
              <View style={styles.colQtyInput}>
                <TextInput
                  placeholder="Qty"
                  value={newItemQty}
                  onChangeText={setNewItemQty}
                  keyboardType="numeric"
                  size="sm"
                  align="right"
                />
              </View>
              <View style={styles.colPackagingInput}>
                <TextInput
                  placeholder="Packaging..."
                  value={newItemPackaging}
                  onChangeText={setNewItemPackaging}
                  size="sm"
                />
              </View>
              <View style={styles.colAction}>
                <Pressable onPress={handleCreateItem} style={styles.saveAddBtn}>
                  <MaterialIcons
                    name="check"
                    size={16}
                    color={COLORS.statusPaidText}
                  />
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Footer info & Total Count */}
        <View style={styles.tableFooter}>
          <View style={styles.totalBadge}>
            <Text variant="bodySm" color={COLORS.textSecondary}>
              Total Count:
            </Text>
            <View style={styles.totalPill}>
              <Text variant="tabularData" style={styles.totalNumber}>
                {totalPieces} Pcs
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Mobile Version
  return (
    <View style={styles.container}>
      {/* Mobile Section Header */}
      <View style={styles.sectionHeader}>
        <Text
          variant="labelSm"
          color={COLORS.textMuted}
          style={styles.sectionTitle}
        >
          LOADED MANIFEST
        </Text>
        <Text variant="bodySm" color={COLORS.textMuted}>
          Bay Verified
        </Text>
      </View>

      {/* Mobile Card Rows */}
      <View style={styles.tableBorder}>
        {items.map((item, idx) => (
          <View
            key={item.id}
            style={[
              styles.mobileRow,
              idx < items.length - 1 && styles.rowDivider,
            ]}
          >
            <View style={styles.mobileItemInfo}>
              <Text
                variant="bodyMd"
                color={COLORS.textPrimary}
                style={styles.mobileItemName}
              >
                {item.description}
              </Text>
              <Text variant="bodySm" color={COLORS.textMuted}>
                {item.bayId || `Bay-3-A${idx + 1}`} •{" "}
                {item.packaging || "Units"}
              </Text>
            </View>

            <View style={styles.mobileQtyBadge}>
              <Text variant="labelSm" color={COLORS.textMuted}>
                Qty
              </Text>
              <Text
                variant="tabularData"
                color={COLORS.textPrimary}
                style={styles.mobileQtyValue}
              >
                {item.quantity}
              </Text>
              <Pressable
                onPress={() => onRemoveItem(item.id)}
                style={styles.mobileDeleteBtn}
              >
                <MaterialIcons
                  name="close"
                  size={14}
                  color={COLORS.textMuted}
                />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Inline Add Item Form on Mobile */}
        {isAdding ? (
          <View style={styles.mobileAddForm}>
            <TextInput
              placeholder="Item name..."
              value={newItemName}
              onChangeText={setNewItemName}
              size="sm"
              autoFocus
            />
            <View style={styles.mobileAddGrid}>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder="Qty"
                  value={newItemQty}
                  onChangeText={setNewItemQty}
                  keyboardType="numeric"
                  size="sm"
                />
              </View>
              <View style={{ flex: 2 }}>
                <TextInput
                  placeholder="Packaging"
                  value={newItemPackaging}
                  onChangeText={setNewItemPackaging}
                  size="sm"
                />
              </View>
            </View>
            <View style={styles.mobileAddActions}>
              <Pressable
                onPress={() => setIsAdding(false)}
                style={styles.mobileCancelBtn}
              >
                <Text variant="labelSm" color={COLORS.textSecondary}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCreateItem}
                style={styles.mobileSaveBtn}
              >
                <Text variant="labelSm" color="#FFFFFF">
                  Add to Manifest
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={() => setIsAdding(true)}
            style={({ pressed }: any) => [
              styles.mobileAddTrigger,
              pressed && styles.pressed,
            ]}
          >
            <MaterialIcons name="add" size={16} color={COLORS.secondary} />
            <Text
              variant="bodySm"
              color={COLORS.secondary}
              style={styles.mobileAddTriggerText}
            >
              Add Item
            </Text>
          </Pressable>
        )}

        {/* Mobile Total Summary */}
        <View style={styles.mobileTotalSummary}>
          <Text
            variant="labelSm"
            color={COLORS.textPrimary}
            style={{ fontWeight: "600" }}
          >
            Total: {totalPieces} Pieces
          </Text>
          <Text variant="bodySm" color={COLORS.textMuted}>
            Pricing masked
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.spaceSm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingBottom: SPACING.spaceXs + 2,
  },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addBtnText: {
    fontWeight: "500",
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },
  tableHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.spaceSm,
    paddingHorizontal: SPACING.spaceSm + 2,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingVertical: SPACING.spaceSm,
    paddingHorizontal: SPACING.spaceSm + 2,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: SPACING.spaceSm,
    paddingHorizontal: SPACING.spaceSm + 2,
    gap: SPACING.spaceSm,
  },
  colIndex: {
    width: 32,
    fontFamily: TYPOGRAPHY.tabularMono.fontFamily,
  },
  colDesc: {
    flex: 3,
    paddingRight: SPACING.spaceSm,
  },
  colDescInput: {
    flex: 3,
  },
  itemTitle: {
    fontWeight: "500",
  },
  itemSku: {
    fontSize: 11,
    marginLeft: 4,
  },
  colUnit: {
    width: 60,
  },
  colUnitInput: {
    width: 60,
  },
  colQty: {
    width: 70,
    textAlign: "right",
  },
  colQtyText: {
    width: 70,
    textAlign: "right",
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  colQtyInput: {
    width: 70,
  },
  colPackaging: {
    flex: 2,
    paddingLeft: SPACING.spaceSm,
  },
  colPackagingInput: {
    flex: 2,
  },
  colAction: {
    width: 32,
    alignItems: "flex-end",
  },
  deleteBtn: {
    padding: 4,
  },
  saveAddBtn: {
    padding: 4,
  },
  tableFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceXs,
    paddingTop: 2,
  },
  footerNote: {
    fontSize: 11,
  },
  totalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  totalPill: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.spaceSm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  totalNumber: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  // Mobile styles
  mobileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm + 2,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  mobileItemInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: SPACING.spaceSm,
  },
  mobileItemName: {
    fontWeight: "500",
    marginBottom: 2,
  },
  mobileQtyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mobileQtyValue: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  mobileDeleteBtn: {
    marginLeft: 6,
    padding: 4,
  },
  mobileAddTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: SPACING.spaceSm + 2,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  mobileAddTriggerText: {
    fontWeight: "500",
    fontSize: 12,
  },
  mobileAddForm: {
    padding: SPACING.spaceBase,
    gap: SPACING.spaceSm,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  mobileAddGrid: {
    flexDirection: "row",
    gap: SPACING.spaceSm,
  },
  mobileAddActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.spaceSm,
    marginTop: 4,
  },
  mobileCancelBtn: {
    paddingHorizontal: SPACING.spaceSm + 2,
    paddingVertical: 6,
  },
  mobileSaveBtn: {
    backgroundColor: COLORS.textPrimary,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: 6,
  },
  mobileTotalSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
});
