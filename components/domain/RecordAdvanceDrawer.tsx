/**
 * Gripwell - Domain Component: RecordAdvanceDrawer
 * Slide-over drawer to record pre-funded customer advance deposits.
 * Minimalist, compact form with real photo/document upload and validation.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { AdvanceDepositItem } from "../../types/models";
import { ImageAsset, ImageCaptureField } from "../forms/ImageCaptureField";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { TextInput } from "../ui/TextInput";

export interface RecordAdvanceDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSaveDeposit: (newDeposit: AdvanceDepositItem) => void;
  isDesktop?: boolean;
}

const INSTRUMENTS: { id: "upi" | "bank" | "cheque" | "cash"; label: string }[] =
  [
    { id: "upi", label: "UPI" },
    { id: "bank", label: "Bank Transfer" },
    { id: "cheque", label: "Cheque" },
    { id: "cash", label: "Cash" },
  ];

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
  const [proofAsset, setProofAsset] = useState<ImageAsset | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
    if (!customer.trim()) {
      setError("Customer name is required");
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid deposit amount");
      return;
    }

    const newDeposit: AdvanceDepositItem = {
      id: `ADV-${Date.now().toString().slice(-4)}`,
      code: `A${Math.floor(Math.random() * 90 + 10)}`,
      customerName: customer.trim(),
      mode: instrument.toUpperCase(),
      timestamp: "Today, Just now",
      status: "Pending Load",
      totalAdvance: parsedAmount,
      applied: 0,
      remaining: parsedAmount,
      note: memo.trim() || undefined,
      depositSlipFilename: proofAsset?.name,
      appliedMapping: [],
      appliedMappings: [],
    };

    onSaveDeposit(newDeposit);
    setCustomer("");
    setAmount("");
    setMemo("");
    setProofAsset(null);
    setError(null);
    onClose();
  };

  if (!visible) return null;

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
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text variant="headlineSm" color={COLORS.textPrimary}>
                Record Customer Advance
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={{ marginTop: 2 }}
              >
                Pre-funded ledger deposit for future dispatch clearances
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close drawer"
            >
              <MaterialIcons
                name="close"
                size={20}
                color={COLORS.textSecondary}
              />
            </Pressable>
          </View>

          {/* Form Scroll Body */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {error ? (
              <View style={styles.errorBanner}>
                <MaterialIcons name="error-outline" size={16} color="#DC2626" />
                <Text variant="bodySm" style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Customer Name */}
            <View style={styles.fieldGroup}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.fieldLabel}
              >
                CUSTOMER NAME *
              </Text>
              <TextInput
                value={customer}
                onChangeText={(val) => {
                  setCustomer(val);
                  if (error) setError(null);
                }}
                placeholder="e.g. KK Stores, Sri Murugan Traders"
                size="sm"
              />
            </View>

            {/* Deposit Amount */}
            <View style={styles.fieldGroup}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.fieldLabel}
              >
                DEPOSIT AMOUNT (₹) *
              </Text>
              <TextInput
                value={amount}
                onChangeText={(val) => {
                  setAmount(val);
                  if (error) setError(null);
                }}
                placeholder="5000"
                keyboardType="numeric"
                prefix="₹"
                mono
                size="sm"
              />
            </View>

            {/* Instrument / Payment Mode */}
            <View style={styles.fieldGroup}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.fieldLabel}
              >
                PAYMENT INSTRUMENT *
              </Text>
              <View style={styles.instrumentRow}>
                {INSTRUMENTS.map((inst) => {
                  const isSelected = instrument === inst.id;
                  return (
                    <Pressable
                      key={inst.id}
                      onPress={() => setInstrument(inst.id)}
                      style={[
                        styles.instrumentBtn,
                        isSelected && styles.instrumentBtnActive,
                      ]}
                    >
                      <Text
                        variant="labelSm"
                        color={
                          isSelected ? COLORS.primary : COLORS.textSecondary
                        }
                        style={
                          isSelected
                            ? styles.instrumentTextActive
                            : styles.instrumentText
                        }
                      >
                        {inst.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Reference Memo / UTR */}
            <View style={styles.fieldGroup}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.fieldLabel}
              >
                TRANSACTION REFERENCE / UTR / MEMO
              </Text>
              <TextInput
                value={memo}
                onChangeText={setMemo}
                placeholder="e.g. UPI Ref #, NEFT UTR, Cheque No."
                size="sm"
              />
            </View>

            {/* Deposit Slip Upload */}
            <View style={styles.fieldGroup}>
              <ImageCaptureField
                label="DEPOSIT SLIP / BANK ACKNOWLEDGEMENT"
                supportingText="Optional proof • Gallery or file picker"
                mode="gallery_only"
                onImageChange={setProofAsset}
                compact
              />
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Button
              label="Cancel"
              variant="outline"
              size="md"
              onPress={onClose}
              style={{ flex: 1 }}
            />
            <Button
              label="Confirm Advance Deposit"
              icon="check"
              variant="primary"
              size="md"
              onPress={handleSave}
              style={{ flex: 1.5 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  scrim: {
    ...StyleSheet.absoluteFill,
  },
  drawerSheet: {
    width: "100%",
    maxWidth: 440,
    height: "100%",
    backgroundColor: COLORS.surface,
    zIndex: 10,
    ...Platform.select({
      web: {
        boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  drawerSheetDesktop: {
    width: 440,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceLg,
    paddingVertical: SPACING.spaceMd,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  closeBtn: {
    padding: 6,
    borderRadius: RADIUS.xs,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.spaceLg,
    gap: SPACING.spaceMd,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  instrumentRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  instrumentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  instrumentBtnActive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
  },
  instrumentText: {
    fontSize: 12,
  },
  instrumentTextActive: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    padding: SPACING.spaceMd,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    backgroundColor: COLORS.surface,
  },
});
