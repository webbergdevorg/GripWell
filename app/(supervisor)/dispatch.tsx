/**
 * Gripwell - Supervisor Workspace: Outbound Dispatch & Gate Pass
 * Stitch References:
 * - Desktop: e9b548ccd0614c4189ec143905d33313
 * - Mobile: cc0a7d9be25f4b6fa0ea9a227bcb3f76
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CargoPhotoCard } from "../../components/domain/CargoPhotoCard";
import { DockMonitorPanel } from "../../components/domain/DockMonitorPanel";
import { ManifestTable } from "../../components/domain/ManifestTable";
import { DesktopHeader } from "../../components/navigation/DesktopHeader";
import { MobileSupervisorHeader } from "../../components/navigation/MobileSupervisorHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { TextInput } from "../../components/ui/TextInput";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import { INITIAL_CONSIGNMENTS } from "../../services/api/mockData";
import { Consignment, LineItem } from "../../types/models";

const INITIAL_MANIFEST_ITEMS: LineItem[] = [
  {
    id: "m-01",
    description: "Plastic Moulded Arm",
    sku: "PMA-884",
    unit: "Units",
    quantity: 50,
    unitPrice: 0, // Masked
    total: 0, // Masked
    packaging: "Carton (5 × 10)",
    bayId: "Bay-3-A12",
  },
  {
    id: "m-02",
    description: "Heavy-Duty Storage Crate",
    sku: "HDC-900",
    unit: "Units",
    quantity: 30,
    unitPrice: 0, // Masked
    total: 0, // Masked
    packaging: "Palletized, Strapped",
    bayId: "Bay-3-B04",
  },
];

export default function SupervisorDispatchWorkspace() {
  const { isDesktop, isMobile } = useResponsive();
  const insets = useSafeAreaInsets();

  // Consignment / Dispatch Form State
  const [customerName, setCustomerName] = useState(
    "Sri Murugan Traders - Salem Hub",
  );
  const [customerPhone, setCustomerPhone] = useState("+91 94432 18742");
  const [driverName, setDriverName] = useState("Rajan Kumar");
  const [driverPhone, setDriverPhone] = useState("+91 98421 90812");
  const [vehicleReg, setVehicleReg] = useState("TN 01 AB 1234");
  const [loadId, setLoadId] = useState("");
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

  const handleCancel = () => {
    setNotes("");
    setGatePassIssued(false);
  };

  // -------------------------------------------------------------
  // DESKTOP VIEW (e9b548ccd0614c4189ec143905d33313)
  // -------------------------------------------------------------
  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Sticky Desktop Header */}
        <DesktopHeader activeSection="dispatch" />

        <ScrollView
          style={styles.desktopScroll}
          contentContainerStyle={styles.desktopScrollContent}
        >
          <View style={styles.desktopMaxContainer}>
            {/* Page Title & Status Header */}
            <View style={styles.pageTitleBar}>
              <View>
                <Text
                  variant="headlineMd"
                  color={COLORS.textPrimary}
                  style={styles.pageTitle}
                >
                  New Dispatch
                </Text>
                <Text
                  variant="bodySm"
                  color={COLORS.textSecondary}
                  style={styles.pageSubtitle}
                >
                  Stage outbound truck, verify manifest count, and issue driver
                  gate pass.
                </Text>
              </View>

              <View style={styles.headerRightTags}>
                <Text
                  variant="tabularData"
                  color={COLORS.textMuted}
                  style={styles.loadCode}
                >
                  LOAD-004
                </Text>
                <Badge label="Staging" variant="staging" />
              </View>
            </View>

            {/* Success Toast / Notification Banner */}
            {gatePassIssued && (
              <View style={styles.gatePassToast}>
                <MaterialIcons
                  name="check-circle"
                  size={18}
                  color={COLORS.statusPaidText}
                />
                <View style={styles.gatePassToastContent}>
                  <Text
                    variant="bodyMd"
                    color={COLORS.textPrimary}
                    style={{ fontWeight: "600" }}
                  >
                    Gate Pass Issued (#{gatePassCode})
                  </Text>
                  <Text variant="bodySm" color={COLORS.textSecondary}>
                    Automated SMS with gate clearance link sent to {driverPhone}
                    .
                  </Text>
                </View>
              </View>
            )}

            {/* 12-Column Grid Layout */}
            <View style={styles.desktopGrid}>
              {/* 8-Column Main Staging Form */}
              <View style={styles.desktopMainForm}>
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

                  <View style={styles.fieldsGrid}>
                    {/* Customer Name */}
                    <View style={styles.fieldCol}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textSecondary}
                        style={styles.fieldLabel}
                      >
                        Customer Name
                      </Text>
                      <TextInput
                        value={customerName}
                        onChangeText={setCustomerName}
                        size="sm"
                      />
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        style={styles.fieldHelper}
                      >
                        Plot #14, Bypass Road, Ammapet, Salem
                      </Text>
                    </View>

                    {/* Customer Phone */}
                    <View style={styles.fieldCol}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textSecondary}
                        style={styles.fieldLabel}
                      >
                        Customer Phone
                      </Text>
                      <TextInput
                        value={customerPhone}
                        onChangeText={setCustomerPhone}
                        keyboardType="phone-pad"
                        mono
                        size="sm"
                      />
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        style={styles.fieldHelper}
                      >
                        Consignee primary contact
                      </Text>
                    </View>

                    {/* Driver Name */}
                    <View style={styles.fieldCol}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textSecondary}
                        style={styles.fieldLabel}
                      >
                        Driver Name
                      </Text>
                      <TextInput
                        value={driverName}
                        onChangeText={setDriverName}
                        size="sm"
                      />
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        style={styles.fieldHelper}
                      >
                        DL: TN-07-2018-884712
                      </Text>
                    </View>

                    {/* Driver Phone */}
                    <View style={styles.fieldCol}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textSecondary}
                        style={styles.fieldLabel}
                      >
                        Driver Phone
                      </Text>
                      <TextInput
                        value={driverPhone}
                        onChangeText={setDriverPhone}
                        keyboardType="phone-pad"
                        mono
                        size="sm"
                      />
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        style={styles.fieldHelper}
                      >
                        Auto-sends digital gate pass SMS
                      </Text>
                    </View>

                    {/* Vehicle Reg */}
                    <View style={styles.fieldCol}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textSecondary}
                        style={styles.fieldLabel}
                      >
                        Vehicle Registration No.
                      </Text>
                      <TextInput
                        value={vehicleReg}
                        onChangeText={setVehicleReg}
                        autoCapitalize="characters"
                        mono
                        size="sm"
                      />
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        style={styles.fieldHelper}
                      >
                        VAHAN verified ✓
                      </Text>
                    </View>

                    {/* Load ID */}
                    <View style={styles.fieldCol}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textSecondary}
                        style={styles.fieldLabel}
                      >
                        Load ID
                      </Text>
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
                      >
                        Auto-generated Load Sequence (YYYYMMDDXXXX)
                      </Text>
                    </View>

                    {/* Other Notes */}
                    <View style={styles.fieldColFull}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textSecondary}
                        style={styles.fieldLabel}
                      >
                        Other Notes
                      </Text>
                      <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Enter additional notes or remarks (optional)"
                        size="sm"
                      />
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        style={styles.fieldHelper}
                      >
                        Optional consignee or vehicle remarks
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 2. Merchandise Manifest */}
                <ManifestTable
                  items={manifestItems}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  isDesktop={true}
                />

                {/* 3. Verification & Handover */}
                <View style={styles.formSection}>
                  <View style={styles.formSectionHeader}>
                    <Text
                      variant="labelSm"
                      color={COLORS.textMuted}
                      style={styles.formSectionTitle}
                    >
                      3. VERIFICATION & HANDOVER
                    </Text>
                    <Text variant="labelSm" color={COLORS.textMuted}>
                      Compliance Check
                    </Text>
                  </View>

                  <View style={styles.verificationGrid}>
                    <View style={{ flex: 1 }}>
                      <CargoPhotoCard isDesktop={true} />
                    </View>
                  </View>
                </View>
              </View>

              {/* 4-Column Side Monitor */}
              <View style={styles.desktopSideMonitor}>
                <DockMonitorPanel
                  recentLoads={recentLoads}
                  isSubmitting={isSubmitting}
                  gatePassIssued={gatePassIssued}
                  onSubmitDispatch={handleSubmitDispatch}
                  onCancel={handleCancel}
                  onViewGatePass={() =>
                    router.push("/(supervisor)/gate-pass" as any)
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // MOBILE VIEW (cc0a7d9be25f4b6fa0ea9a227bcb3f76)
  // -------------------------------------------------------------
  return (
    <View style={styles.mobileContainer}>
      {/* Sticky Mobile Supervisor Header */}
      <MobileSupervisorHeader dockName="Dock Bay 3" />

      <ScrollView
        style={styles.mobileScroll}
        contentContainerStyle={[
          styles.mobileScrollContent,
          {
            paddingBottom: Math.max(
              insets.bottom + SPACING.spaceBase,
              SPACING.spaceXl,
            ),
          },
        ]}
      >
        {/* Load Header Bar */}
        <View style={styles.mobileHeaderBar}>
          <Text
            variant="headlineMd"
            color={COLORS.textPrimary}
            style={styles.mobileTitle}
          >
            New Dispatch
          </Text>
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
                  <MaterialIcons
                    name="call"
                    size={13}
                    color={COLORS.textMuted}
                  />
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
                <Text
                  variant="bodySm"
                  color={COLORS.textMuted}
                  style={styles.fieldHelper}
                  numberOfLines={1}
                >
                  DL: TN-07-2018-884712
                </Text>
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
                <Text
                  variant="bodySm"
                  color={COLORS.statusPaidText}
                  style={styles.fieldHelper}
                  numberOfLines={1}
                >
                  VAHAN verified ✓
                </Text>
              </View>

              {/* Load ID */}
              <View style={styles.mobileFieldCol}>
                <View style={styles.fieldLabelRow}>
                  <MaterialIcons
                    name="tag"
                    size={13}
                    color={COLORS.textMuted}
                  />
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
                <Text
                  variant="bodySm"
                  color={COLORS.textMuted}
                  style={styles.fieldHelper}
                  numberOfLines={1}
                >
                  Optional consignee or vehicle remarks
                </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  // Desktop
  desktopContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  desktopScroll: {
    flex: 1,
  },
  desktopScrollContent: {
    paddingBottom: SPACING.space3xl,
  },
  desktopMaxContainer: {
    maxWidth: 1152,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: SPACING.spaceXl,
    paddingTop: SPACING.spaceXl,
  },
  pageTitleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.spaceMd,
    marginBottom: SPACING.spaceXl,
  },
  pageTitle: {
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    marginTop: 2,
  },
  headerRightTags: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
  },
  loadCode: {
    fontSize: 12,
  },
  gatePassToast: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm + 2,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceMd,
    marginBottom: SPACING.spaceLg,
  },
  gatePassToastContent: {
    flex: 1,
  },
  desktopGrid: {
    flexDirection: "row",
    gap: SPACING.space2xl,
    alignItems: "flex-start",
  },
  desktopMainForm: {
    flex: 8,
    gap: SPACING.space2xl,
  },
  desktopSideMonitor: {
    flex: 4,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    paddingLeft: SPACING.spaceXl,
  },
  formSection: {
    gap: SPACING.spaceMd,
  },
  formSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingBottom: SPACING.spaceXs + 2,
  },
  formSectionTitle: {
    letterSpacing: 0.5,
  },
  fieldsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: SPACING.spaceMd,
    columnGap: SPACING.spaceMd,
  },
  fieldCol: {
    width: "48.5%",
    gap: 4,
  },
  fieldColFull: {
    width: "100%",
    gap: 4,
  },
  fieldLabel: {
    fontWeight: "500",
  },
  fieldHelper: {
    fontSize: 11,
  },
  readOnlyInput: {
    backgroundColor: COLORS.surfaceSecondary,
  },
  verificationGrid: {
    flexDirection: "row",
    gap: SPACING.spaceBase,
  },

  // Mobile
  mobileContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  mobileScroll: {
    flex: 1,
  },
  mobileScrollContent: {
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm,
    gap: SPACING.spaceLg,
    paddingBottom: SPACING.spaceXl,
  },
  mobileHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  mobileTitle: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  mobileSuccessBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm + 2,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceSm + 2,
  },
  mobileFormCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.spaceBase,
  },
  mobileFieldsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: SPACING.spaceMd,
    justifyContent: "space-between",
  },
  mobileFieldCol: {
    width: "48%",
    gap: 4,
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  mobileDetailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: "hidden",
  },
  mobileDetailRow: {
    flexDirection: "row",
  },
  mobileDetailCell: {
    flex: 1,
    padding: SPACING.spaceSm + 2,
    gap: 2,
  },
  cellBorderRight: {
    borderRightWidth: 1,
    borderRightColor: COLORS.borderSubtle,
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  rowBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  cellLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cellValue: {
    fontSize: 12,
    fontWeight: "500",
  },
  cellValueBold: {
    fontSize: 13,
    fontWeight: "500",
  },
  cellSub: {
    fontSize: 11,
    marginTop: 1,
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cellSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    marginTop: 2,
  },
  cellSubText: {
    fontSize: 11,
    fontWeight: "500",
  },
  mobileNotesCell: {
    padding: SPACING.spaceSm + 2,
    gap: 2,
  },
  borderlessInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    height: 28,
  },
  mobileVerificationSection: {
    gap: SPACING.spaceSm,
  },
  sectionHeaderTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  mobileButtonAction: {
    height: 42,
    marginTop: 4,
  },
  mobileButtonSuccess: {
    height: 42,
    marginTop: 4,
    backgroundColor: COLORS.statusPaidText, // Emerald
  },
  mobileRecentSection: {
    gap: SPACING.spaceSm,
  },
  mobileRecentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mobileRecentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: "hidden",
  },
  mobileRecentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm + 2,
  },
  mobileRecentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm + 2,
    flex: 1,
    minWidth: 0,
    paddingRight: SPACING.spaceSm,
  },
  recentSeq: {
    fontSize: 11,
  },
  recentCust: {
    fontWeight: "500",
    fontSize: 13,
  },
  recentMeta: {
    fontSize: 11,
  },
  pressed: {
    opacity: 0.8,
  },
});
