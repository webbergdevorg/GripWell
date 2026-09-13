/**
 * Gripwell - Domain Component: RecordAdvanceDrawer
 * Slide-over drawer for recording pre-funded customer advances (#advanceDrawer).
 * Matches Stitch Screen 9 specifications.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    TextInput as RNTextInput,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { AdvanceDepositItem } from "../../types/models";
import { Text } from "../ui/Text";

export interface RecordAdvanceDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSaveDeposit: (newDeposit: AdvanceDepositItem) => void;
  isDesktop?: boolean;
}

export const RecordAdvanceDrawer: React.FC<RecordAdvanceDrawerProps> = ({
  visible,
  onClose,
  onSaveDeposit,
  isDesktop = false,
}) => {
  const [customer, setCustomer] = useState("KK Stores");
  const [amount, setAmount] = useState("5000");
  const [instrument, setInstrument] = useState<
    "upi" | "bank" | "cheque" | "cash"
  >("upi");
  const [memo, setMemo] = useState("UPI/4028911029/HDFC");
  const [linkedLoad, setLinkedLoad] = useState("unassigned");
  const [hasReceipt, setHasReceipt] = useState(false);

  if (!visible) return null;

  const handleSave = () => {
    const numAmount = parseFloat(amount) || 0;
    const randomCodeNum = Math.floor(3 + Math.random() * 90);
    const newId = `ADV-${randomCodeNum}`;
    const newCode = `A${randomCodeNum}`;

    const instrumentLabel =
      instrument === "upi"
        ? "UPI"
        : instrument === "bank"
          ? "Bank Transfer (IMPS)"
          : instrument === "cheque"
            ? "Cheque Clearing"
            : "Cash Deposit";

    const newDeposit: AdvanceDepositItem = {
      id: newId,
      code: newCode,
      customerName: customer.trim() || "Consignor Client",
      mode: instrumentLabel,
      timestamp: "Today Just Now",
      status:
        linkedLoad === "unassigned" ? "Pending Load" : "Partially Allocated",
      note: memo ? `“${memo}”` : "Pre-funded advance",
      totalAdvance: numAmount,
      applied: 0,
      remaining: numAmount,
      allocation:
        linkedLoad === "unassigned"
          ? "Unassigned buffer"
          : `Linked to ${linkedLoad}`,
    };

    onSaveDeposit(newDeposit);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.scrim} onPress={onClose} />

        <View
          style={[styles.drawerSheet, isDesktop && styles.drawerSheetDesktop]}
        >
          {/* Drawer Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons
                name="payments"
                size={20}
                color={COLORS.secondary}
              />
              <Text variant="headlineSm" style={styles.headerTitle}>
                Record Advance Payment
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={18} color={COLORS.textMuted} />
            </Pressable>
          </View>

          {/* Form Scroll Area */}
          <ScrollView contentContainerStyle={styles.formScroll}>
            {/* Customer Picker */}
            <View style={styles.fieldGroup}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                Customer / Consignor
              </Text>
              <View style={styles.searchWrapper}>
                <RNTextInput
                  value={customer}
                  onChangeText={setCustomer}
                  placeholder="Search customer directory..."
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.textInput}
                />
                <MaterialIcons
                  name="search"
                  size={18}
                  color={COLORS.textMuted}
                  style={styles.searchIcon}
                />
              </View>
            </View>

            {/* Advance Amount */}
            <View style={styles.fieldGroup}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                Advance Amount (₹)
              </Text>
              <View style={styles.currencyWrapper}>
                <Text variant="headlineSm" style={styles.currencyPrefix}>
                  ₹
                </Text>
                <RNTextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.amountInput}
                />
              </View>
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={styles.helpText}
              >
                Funds will be held in unassigned ledger until booked.
              </Text>
            </View>

            {/* Payment Instrument Radio Grid */}
            <View style={styles.fieldGroup}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                Payment Instrument
              </Text>
              <View style={styles.radioGrid}>
                <Pressable
                  onPress={() => setInstrument("upi")}
                  style={[
                    styles.radioCard,
                    instrument === "upi" && styles.radioCardActive,
                  ]}
                >
                  <Text
                    variant="bodySm"
                    style={[
                      styles.radioText,
                      instrument === "upi" && styles.radioTextActive,
                    ]}
                  >
                    UPI / QR
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setInstrument("bank")}
                  style={[
                    styles.radioCard,
                    instrument === "bank" && styles.radioCardActive,
                  ]}
                >
                  <Text
                    variant="bodySm"
                    style={[
                      styles.radioText,
                      instrument === "bank" && styles.radioTextActive,
                    ]}
                  >
                    Bank Transfer
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setInstrument("cheque")}
                  style={[
                    styles.radioCard,
                    instrument === "cheque" && styles.radioCardActive,
                  ]}
                >
                  <Text
                    variant="bodySm"
                    style={[
                      styles.radioText,
                      instrument === "cheque" && styles.radioTextActive,
                    ]}
                  >
                    Cheque
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setInstrument("cash")}
                  style={[
                    styles.radioCard,
                    instrument === "cash" && styles.radioCardActive,
                  ]}
                >
                  <Text
                    variant="bodySm"
                    style={[
                      styles.radioText,
                      instrument === "cash" && styles.radioTextActive,
                    ]}
                  >
                    Cash
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Deposit Reference / Memo */}
            <View style={styles.fieldGroup}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                Deposit Reference / Memo
              </Text>
              <RNTextInput
                value={memo}
                onChangeText={setMemo}
                placeholder="e.g. UTR / Transaction Hash"
                placeholderTextColor={COLORS.textMuted}
                style={styles.textInput}
              />
            </View>

            {/* Receipt Upload Dropzone */}
            <View style={styles.fieldGroup}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                Payment Proof (Screenshot / Slip)
              </Text>
              <Pressable
                onPress={() => setHasReceipt(!hasReceipt)}
                style={[styles.dropzone, hasReceipt && styles.dropzoneActive]}
              >
                <MaterialIcons
                  name={hasReceipt ? "check-circle" : "cloud-upload"}
                  size={26}
                  color={hasReceipt ? "#059669" : COLORS.secondary}
                />
                <Text variant="bodySm" color={COLORS.textPrimary}>
                  {hasReceipt ? (
                    <Text
                      variant="bodySm"
                      style={{ color: "#059669", fontWeight: "600" }}
                    >
                      Receipt Attached (slip_oct24.png)
                    </Text>
                  ) : (
                    <>
                      <Text
                        variant="bodySm"
                        style={{ color: COLORS.secondary, fontWeight: "600" }}
                      >
                        Click to upload
                      </Text>{" "}
                      or drag receipt
                    </>
                  )}
                </Text>
                <Text variant="labelSm" color={COLORS.textMuted}>
                  PNG, JPG, PDF up to 10MB
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text variant="labelMd" color={COLORS.textSecondary}>
                Cancel
              </Text>
            </Pressable>
            <Pressable onPress={handleSave} style={styles.saveBtn}>
              <Text variant="labelMd" style={styles.saveBtnText}>
                Save Deposit
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  scrim: {
    ...StyleSheet.absoluteFill,
  },
  drawerSheet: {
    width: "100%",
    maxWidth: 440,
    height: "100%",
    backgroundColor: COLORS.surface,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    justifyContent: "space-between",
    ...Platform.select({
      web: {
        boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
      },
    }),
  },
  drawerSheetDesktop: {
    maxWidth: 420,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm + 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: "#F8FAFC",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    padding: SPACING.spaceBase,
    gap: SPACING.spaceBase,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  searchWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  textInput: {
    height: 38,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceSm + 2,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  searchIcon: {
    position: "absolute",
    right: 10,
  },
  currencyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceSm + 2,
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    height: 38,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  helpText: {
    fontSize: 11,
  },
  radioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  radioCard: {
    width: "48%",
    paddingVertical: 9,
    paddingHorizontal: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCardActive: {
    backgroundColor: "#EFF6FF",
    borderColor: COLORS.secondary,
  },
  radioText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  radioTextActive: {
    color: COLORS.secondary,
    fontWeight: "700",
  },
  dropzone: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: COLORS.borderDashed,
    borderStyle: "dashed",
    borderRadius: RADIUS.md,
    padding: SPACING.spaceBase,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dropzoneActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceSm,
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm + 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: "#F8FAFC",
  },
  cancelBtn: {
    height: 36,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  saveBtn: {
    height: 36,
    paddingHorizontal: SPACING.spaceLg,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});
