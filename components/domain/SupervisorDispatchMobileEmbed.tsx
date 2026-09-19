/**
 * Gripwell - Supervisor Dispatch Mobile Embed
 * Embedded full layout of Supervisor Dispatch screen for Office Admin mobile view.
 * Allows office admins to manage dispatch operations directly without route changes.
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { INITIAL_CONSIGNMENTS } from "../../services/api/mockData";
import { Consignment, LineItem } from "../../types/models";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { TextInput } from "../ui/TextInput";
import { CargoPhotoCard } from "./CargoPhotoCard";
import { ManifestTable } from "./ManifestTable";

const INITIAL_MANIFEST_ITEMS: LineItem[] = [
  {
    id: "m-01",
    description: "Plastic Moulded Arm",
    sku: "PMA-884",
    unit: "Units",
    quantity: 50,
    unitPrice: 0,
    total: 0,
    packaging: "Carton (5 × 10)",
    bayId: "Bay-3-A12",
  },
  {
    id: "m-02",
    description: "Heavy-Duty Storage Crate",
    sku: "HDC-900",
    unit: "Units",
    quantity: 30,
    unitPrice: 0,
    total: 0,
    packaging: "Palletized, Strapped",
    bayId: "Bay-3-B04",
  },
];

export const SupervisorDispatchMobileEmbed: React.FC = () => {
  // Consignment / Dispatch Form State
  const [customerName, setCustomerName] = useState(
    "Sri Murugan Traders - Salem Hub",
  );
  const [customerPhone, setCustomerPhone] = useState("+91 94432 18742");
  const [driverName, setDriverName] = useState("Rajan Kumar");
  const [driverPhone, setDriverPhone] = useState("+91 98421 90812");
  const [vehicleReg, setVehicleReg] = useState("TN 01 AB 1234");
  const [loadId, setLoadId] = useState("202410240004");
  const [notes, setNotes] = useState("");

  // Manifest items state
  const [manifestItems, setManifestItems] = useState<LineItem[]>(
    INITIAL_MANIFEST_ITEMS,
  );

  // Recent loads history
  const [recentLoads] = useState<Consignment[]>(INITIAL_CONSIGNMENTS);

  // Gate Pass submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gatePassIssued, setGatePassIssued] = useState(false);
  const [gatePassCode, setGatePassCode] = useState("");

  const handleAddItem = (item: LineItem) => {
    setManifestItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (id: string) => {
    setManifestItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitDispatch = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setGatePassIssued(true);
      setGatePassCode("GP-04");
    }, 800);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Load Header Bar */}
      <View style={styles.mobileHeaderBar}>
        <View>
          <Text
            variant="headlineMd"
            color={COLORS.textPrimary}
            style={styles.mobileTitle}
          >
            Outbound Dispatch
          </Text>
        </View>
        <Badge label="Ready for Seal" variant="ready_for_seal" />
      </View>

      {/* Success Banner */}
      {gatePassIssued && (
        <Pressable
          onPress={() => router.push("/(supervisor)/gate-pass" as any)}
          style={({ pressed }: any) => [
            styles.mobileSuccessBanner,
            pressed && styles.pressed,
          ]}
        >
          <MaterialIcons
            name="check-circle"
            size={20}
            color={COLORS.statusPaidText}
          />
          <View style={{ flex: 1 }}>
            <Text
              variant="bodyMd"
              color={COLORS.textPrimary}
              style={{ fontWeight: "600" }}
            >
              Gate Pass #{gatePassCode} Issued
            </Text>
            <Text variant="bodySm" color={COLORS.textSecondary}>
              Tap to view digital pass & seal proof →
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={COLORS.textMuted}
          />
        </Pressable>
      )}

      {/* 1. Vehicle & Consignee */}
      <View style={styles.formSection}>
        <View style={styles.formSectionHeader}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.formSectionTitle}
          >
            1. VEHICLE & CONSIGNEE
          </Text>
          <Text variant="labelSm" color={COLORS.textMuted}>
            Dispatch Details
          </Text>
        </View>

        <View style={styles.mobileFormCard}>
          <View style={styles.mobileFieldsGrid}>
            {/* Customer Name */}
            <View style={styles.mobileFieldCol}>
              <View style={styles.fieldLabelRow}>
                <MaterialIcons
                  name="storefront"
                  size={13}
                  color={COLORS.textMuted}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.fieldLabel}
                >
                  Customer Name
                </Text>
              </View>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Customer Name"
                size="sm"
              />
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={styles.fieldHelper}
                numberOfLines={1}
              >
                Plot #14, Bypass Road, Salem
              </Text>
            </View>

            {/* Customer Phone */}
            <View style={styles.mobileFieldCol}>
              <View style={styles.fieldLabelRow}>
                <MaterialIcons name="call" size={13} color={COLORS.textMuted} />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.fieldLabel}
                >
                  Customer Phone
                </Text>
              </View>
              <TextInput
                value={customerPhone}
                onChangeText={setCustomerPhone}
                placeholder="+91 94432 18742"
                keyboardType="phone-pad"
                mono
                size="sm"
              />
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={styles.fieldHelper}
                numberOfLines={1}
              >
                Consignee contact
              </Text>
            </View>

            {/* Driver Name */}
            <View style={styles.mobileFieldCol}>
              <View style={styles.fieldLabelRow}>
                <MaterialIcons
                  name="person"
                  size={13}
                  color={COLORS.textMuted}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.fieldLabel}
                >
                  Driver Name
                </Text>
              </View>
              <TextInput
                value={driverName}
                onChangeText={setDriverName}
                placeholder="Driver Name"
                size="sm"
              />
            </View>

            {/* Driver Phone */}
            <View style={styles.mobileFieldCol}>
              <View style={styles.fieldLabelRow}>
                <MaterialIcons
                  name="phone-android"
                  size={13}
                  color={COLORS.textMuted}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.fieldLabel}
                >
                  Driver Phone
                </Text>
              </View>
              <TextInput
                value={driverPhone}
                onChangeText={setDriverPhone}
                placeholder="+91 98421 90812"
                keyboardType="phone-pad"
                mono
                size="sm"
              />
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={styles.fieldHelper}
                numberOfLines={1}
              >
                Gate pass SMS
              </Text>
            </View>

            {/* Vehicle Registration */}
            <View style={styles.mobileFieldCol}>
              <View style={styles.fieldLabelRow}>
                <MaterialIcons
                  name="local-shipping"
                  size={13}
                  color={COLORS.textMuted}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.fieldLabel}
                >
                  Vehicle Reg No.
                </Text>
              </View>
              <TextInput
                value={vehicleReg}
                onChangeText={setVehicleReg}
                placeholder="TN 01 AB 1234"
                autoCapitalize="characters"
                mono
                size="sm"
              />
            </View>

            {/* Load ID */}
            <View style={styles.mobileFieldCol}>
              <View style={styles.fieldLabelRow}>
                <MaterialIcons name="tag" size={13} color={COLORS.textMuted} />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.fieldLabel}
                >
                  Load ID
                </Text>
              </View>
              <TextInput
                value={loadId}
                onChangeText={setLoadId}
                placeholder="YYYYMMDDXXXX"
                mono
                size="sm"
              />
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={styles.fieldHelper}
                numberOfLines={1}
              >
                Sequence format
              </Text>
            </View>

            {/* Other Notes */}
            <View style={styles.fieldColFull}>
              <View style={styles.fieldLabelRow}>
                <MaterialIcons
                  name="notes"
                  size={13}
                  color={COLORS.textMuted}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.fieldLabel}
                >
                  Other Notes
                </Text>
              </View>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Enter additional notes or remarks (optional)"
                size="sm"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Loaded Manifest */}
      <ManifestTable
        items={manifestItems}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        isDesktop={false}
      />

      {/* Verification & Proof */}
      <View style={styles.mobileVerificationSection}>
        <Text
          variant="labelSm"
          color={COLORS.textMuted}
          style={styles.sectionHeaderTitle}
        >
          VERIFICATION & PROOF
        </Text>
        <CargoPhotoCard isDesktop={false} />

        {/* Primary Action Button */}
        <Button
          label={
            gatePassIssued
              ? "Gate Pass Issued (#GP-04) ✓"
              : isSubmitting
                ? "Generating Gate Pass..."
                : "Submit Dispatch & Gate Pass"
          }
          icon={gatePassIssued ? "check" : "assignment-turned-in"}
          variant="primary"
          onPress={handleSubmitDispatch}
          disabled={isSubmitting || gatePassIssued}
          style={
            gatePassIssued
              ? styles.mobileButtonSuccess
              : styles.mobileButtonAction
          }
        />
      </View>

      {/* Recent Loads (Today) */}
      <View style={styles.mobileRecentSection}>
        <View style={styles.mobileRecentHeader}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.sectionHeaderTitle}
          >
            RECENT LOADS (TODAY)
          </Text>
          <Text variant="labelSm" color={COLORS.textMuted}>
            3 completed
          </Text>
        </View>

        <View style={styles.mobileRecentCard}>
          {recentLoads.map((load, idx) => (
            <View
              key={load.id}
              style={[
                styles.mobileRecentRow,
                idx < recentLoads.length - 1 && styles.rowBorderBottom,
              ]}
            >
              <View style={styles.mobileRecentInfo}>
                <Text
                  variant="tabularData"
                  color={COLORS.textMuted}
                  style={styles.recentSeq}
                >
                  #{3 - idx}
                </Text>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    variant="bodyMd"
                    color={COLORS.textPrimary}
                    style={styles.recentCust}
                    numberOfLines={1}
                  >
                    {load.customerName}
                  </Text>
                  <Text
                    variant="bodySm"
                    color={COLORS.textMuted}
                    style={styles.recentMeta}
                  >
                    {load.dispatchTime.replace("Today ", "")} •{" "}
                    {load.vehicleNumber}
                  </Text>
                </View>
              </View>

              <Badge
                label={
                  load.status === "settled"
                    ? "Paid"
                    : load.status === "credit"
                      ? "Credit"
                      : "Pending"
                }
                variant={
                  load.status === "settled"
                    ? "paid"
                    : load.status === "credit"
                      ? "credit"
                      : "pending"
                }
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  contentContainer: {
    paddingHorizontal: SPACING.spaceBase,
    paddingTop: SPACING.spaceSm,
    paddingBottom: 80, // Space for bottom navigation
  },
  mobileHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.spaceSm + 2,
  },
  mobileTitle: {
    fontWeight: "700",
  },
  mobileSuccessBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    backgroundColor: COLORS.statusPaidBg,
    borderWidth: 1,
    borderColor: COLORS.statusPaidBorder,
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm + 2,
    marginBottom: SPACING.spaceBase,
  },
  pressed: {
    opacity: 0.8,
  },
  formSection: {
    marginBottom: SPACING.spaceBase,
  },
  formSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  formSectionTitle: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  mobileFormCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm + 2,
  },
  mobileFieldsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.spaceSm,
  },
  mobileFieldCol: {
    width: "48%",
    flexGrow: 1,
  },
  fieldColFull: {
    width: "100%",
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  fieldLabel: {
    fontWeight: "500",
    fontSize: 11,
  },
  fieldHelper: {
    fontSize: 10,
    marginTop: 2,
  },
  mobileVerificationSection: {
    marginTop: SPACING.spaceBase,
    gap: SPACING.spaceSm,
  },
  sectionHeaderTitle: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  mobileButtonAction: {
    height: 40,
    backgroundColor: COLORS.primary,
    marginTop: SPACING.spaceSm,
  },
  mobileButtonSuccess: {
    height: 40,
    backgroundColor: COLORS.statusPaidFill,
    borderColor: COLORS.statusPaidFill,
    marginTop: SPACING.spaceSm,
  },
  mobileRecentSection: {
    marginTop: SPACING.spaceLg,
  },
  mobileRecentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  mobileRecentCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
  },
  mobileRecentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.spaceSm + 2,
  },
  rowBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  mobileRecentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    flex: 1,
  },
  recentSeq: {
    fontSize: 12,
  },
  recentCust: {
    fontWeight: "500",
    fontSize: 13,
  },
  recentMeta: {
    fontSize: 11,
  },
});
