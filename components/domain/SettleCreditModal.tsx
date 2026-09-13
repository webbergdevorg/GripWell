/**
 * Gripwell - Domain Component: SettleCreditModal
 * Modal for Split Payment & Credit Settlement (#settleModal).
 * Matches Stitch Screen 9 specifications.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
import { CreditLedgerItem } from "../../types/models";
import { Text } from "../ui/Text";

export interface SettleCreditModalProps {
  visible: boolean;
  item: CreditLedgerItem | null;
  initialApplyAdvance?: boolean;
  onClose: () => void;
  onConfirmClearance: (
    item: CreditLedgerItem,
    offsetApplied: number,
    remainingPaid: number,
    mode: string,
  ) => void;
}

export const SettleCreditModal: React.FC<SettleCreditModalProps> = ({
  visible,
  item,
  initialApplyAdvance = false,
  onClose,
  onConfirmClearance,
}) => {
  const [applyAdvance, setApplyAdvance] = useState(initialApplyAdvance);
  const [settlementAmount, setSettlementAmount] = useState("3500");
  const [settleMode, setSettleMode] = useState<"upi" | "cash" | "neft">("upi");

  useEffect(() => {
    if (item) {
      setApplyAdvance(
        initialApplyAdvance || (item.availableAdvance ? true : false),
      );
      const advance =
        initialApplyAdvance || item.availableAdvance
          ? item.availableAdvance || 0
          : 0;
      const rem = Math.max(0, item.netDue - advance);
      setSettlementAmount(rem.toString());
    }
  }, [item, initialApplyAdvance]);

  if (!visible || !item) return null;

  const handleToggleAdvance = () => {
    const nextState = !applyAdvance;
    setApplyAdvance(nextState);
    const advance = nextState ? item.availableAdvance || 0 : 0;
    const rem = Math.max(0, item.netDue - advance);
    setSettlementAmount(rem.toString());
  };

  const handleExecute = () => {
    const advanceOffset = applyAdvance ? item.availableAdvance || 0 : 0;
    const remPaid = parseFloat(settlementAmount) || 0;
    const modeLabel =
      settleMode === "upi"
        ? "Direct UPI"
        : settleMode === "cash"
          ? "Cash In Hand"
          : "RTGS / NEFT";
    onConfirmClearance(item, advanceOffset, remPaid, modeLabel);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleGroup}>
              <MaterialIcons
                name="account-balance-wallet"
                size={20}
                color={COLORS.secondary}
              />
              <Text variant="headlineSm" style={styles.headerTitle}>
                Split Payment & Credit Settlement
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={18} color={COLORS.textMuted} />
            </Pressable>
          </View>

          {/* Customer & Due Banner */}
          <View style={styles.body}>
            <View style={styles.dueBox}>
              <View>
                <Text variant="headlineSm" style={styles.customerText}>
                  {item.customerName}
                </Text>
                <Text variant="bodySm" color={COLORS.textMuted}>
                  {item.loadNumber} • Net Balance Due
                </Text>
              </View>
              <Text variant="headlineLg" style={styles.dueAmount}>
                ₹{item.netDue.toLocaleString()}
              </Text>
            </View>

            {/* Advance Offset Banner */}
            {item.availableAdvance ? (
              <View style={styles.advanceOffsetBox}>
                <View style={styles.advanceOffsetRow}>
                  <Text variant="labelSm" style={styles.advanceOffsetLabel}>
                    AVAILABLE ADVANCE FOUND
                  </Text>
                  <Text
                    variant="tabularData"
                    style={styles.advanceOffsetAmount}
                  >
                    ₹{item.availableAdvance.toLocaleString()}
                  </Text>
                </View>

                <Pressable
                  onPress={handleToggleAdvance}
                  style={styles.checkboxRow}
                >
                  <View
                    style={[
                      styles.checkbox,
                      applyAdvance && styles.checkboxActive,
                    ]}
                  >
                    {applyAdvance && (
                      <MaterialIcons name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  <Text variant="bodySm" color={COLORS.textPrimary}>
                    Offset ₹{item.availableAdvance.toLocaleString()} immediately
                    from unallocated deposit
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {/* Remaining Settlement Amount */}
            <View style={styles.inputGroup}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                Remaining Settlement Amount (₹)
              </Text>
              <RNTextInput
                value={settlementAmount}
                onChangeText={setSettlementAmount}
                keyboardType="numeric"
                style={styles.numericInput}
              />
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={styles.inputHelp}
              >
                Residual balance to clear {item.loadNumber} completely.
              </Text>
            </View>

            {/* Settlement Source Mode */}
            <View style={styles.inputGroup}>
              <Text variant="labelMd" style={styles.fieldLabel}>
                Settlement Source Mode
              </Text>
              <View style={styles.modesRow}>
                <Pressable
                  onPress={() => setSettleMode("upi")}
                  style={[
                    styles.modeCard,
                    settleMode === "upi" && styles.modeCardActive,
                  ]}
                >
                  <MaterialIcons
                    name="smartphone"
                    size={16}
                    color={
                      settleMode === "upi" ? COLORS.secondary : COLORS.textMuted
                    }
                  />
                  <Text
                    variant="labelSm"
                    style={[
                      styles.modeText,
                      settleMode === "upi" && styles.modeTextActive,
                    ]}
                  >
                    Direct UPI
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setSettleMode("cash")}
                  style={[
                    styles.modeCard,
                    settleMode === "cash" && styles.modeCardActive,
                  ]}
                >
                  <MaterialIcons
                    name="payments"
                    size={16}
                    color={
                      settleMode === "cash"
                        ? COLORS.secondary
                        : COLORS.textMuted
                    }
                  />
                  <Text
                    variant="labelSm"
                    style={[
                      styles.modeText,
                      settleMode === "cash" && styles.modeTextActive,
                    ]}
                  >
                    Cash In Hand
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setSettleMode("neft")}
                  style={[
                    styles.modeCard,
                    settleMode === "neft" && styles.modeCardActive,
                  ]}
                >
                  <MaterialIcons
                    name="account-balance"
                    size={16}
                    color={
                      settleMode === "neft"
                        ? COLORS.secondary
                        : COLORS.textMuted
                    }
                  />
                  <Text
                    variant="labelSm"
                    style={[
                      styles.modeText,
                      settleMode === "neft" && styles.modeTextActive,
                    ]}
                  >
                    RTGS / NEFT
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text variant="labelMd" color={COLORS.textSecondary}>
                Close
              </Text>
            </Pressable>
            <Pressable onPress={handleExecute} style={styles.confirmBtn}>
              <MaterialIcons name="done-all" size={16} color="#FFFFFF" />
              <Text variant="labelMd" style={styles.confirmBtnText}>
                Execute Full Clearance
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.spaceBase,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    width: "100%",
    maxWidth: 480,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    ...Platform.select({
      web: {
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 6,
      },
    }),
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
  headerTitleGroup: {
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
  body: {
    padding: SPACING.spaceBase,
    gap: SPACING.spaceBase,
  },
  dueBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: SPACING.spaceBase,
    borderRadius: RADIUS.md,
  },
  customerText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  dueAmount: {
    fontSize: 22,
    fontWeight: "700",
    color: "#DC2626",
  },
  advanceOffsetBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: RADIUS.md,
    padding: SPACING.spaceSm + 2,
    gap: 6,
  },
  advanceOffsetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  advanceOffsetLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  advanceOffsetAmount: {
    fontWeight: "700",
    color: COLORS.secondary,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: COLORS.secondary,
  },
  inputGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  numericInput: {
    height: 38,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceSm + 2,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  inputHelp: {
    fontSize: 11,
  },
  modesRow: {
    flexDirection: "row",
    gap: SPACING.spaceSm,
    marginTop: 4,
  },
  modeCard: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  modeCardActive: {
    backgroundColor: "#EFF6FF",
    borderColor: COLORS.secondary,
  },
  modeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  modeTextActive: {
    color: COLORS.secondary,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceSm,
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm + 2,
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
  confirmBtn: {
    height: 36,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});
