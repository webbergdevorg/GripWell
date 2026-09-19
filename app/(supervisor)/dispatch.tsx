/**
 * Gripwell - Supervisor Workspace: Outbound Dispatch & Gate Pass
 * Desktop & Mobile responsive dispatch terminal with 2-tab mobile navigation.
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
  const { isDesktop } = useResponsive();
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

  // Supervisor mobile bottom navigation tab
  const [mobileTab, setMobileTab] = useState<"dispatch" | "recent">("dispatch");

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
  // DESKTOP VIEW
  // -------------------------------------------------------------
  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
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
                  color={COLORS.textMuted}
                  style={styles.pageSubtitle}
                >
                  Outbound manifest & vehicle seal authorization
                </Text>
              </View>

              <View style={styles.headerRightTags}>
                <Badge label="Bay 03 Active" variant="settled" />
                <Badge label="Ready for Seal" variant="ready_for_seal" />
              </View>
            </View>

            {/* Success Toast */}
            {gatePassIssued ? (
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
                  </Text>
                </View>
                <Pressable
                  onPress={() => router.push("/(supervisor)/gate-pass" as any)}
                  style={styles.viewPassLink}
                >
                  <Text
                    variant="labelSm"
                    color={COLORS.primary}
                    style={{ fontWeight: "600" }}
                  >
                    View Digital Pass →
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {/* 2-Column Responsive Layout */}
            <View style={styles.desktopGrid}>
              {/* Left Column (8-col): Manifest & Consignment Form */}
              <View style={styles.desktopMainForm}>
                {/* 1. Consignee & Vehicle */}
                <View style={styles.formSection}>
                  <View style={styles.formSectionHeader}>
                    <Text
                      variant="labelSm"
                      color={COLORS.textMuted}
                      style={styles.formSectionTitle}
                    >
                      1. VEHICLE & CONSIGNEE
                    </Text>
                  </View>

                  <View style={styles.fieldsGrid}>
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
                    </View>

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
                    </View>

                    <View style={styles.fieldCol}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textSecondary}
                        style={styles.fieldLabel}
                      >
                        Vehicle Reg No.
                      </Text>
                      <TextInput
                        value={vehicleReg}
                        onChangeText={setVehicleReg}
                        autoCapitalize="characters"
                        mono
                        size="sm"
                      />
                    </View>

                    <View style={styles.fieldCol}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textSecondary}
                        style={styles.fieldLabel}
                      >
                        Load Sequence ID
                      </Text>
                      <TextInput
                        value={loadId}
                        onChangeText={setLoadId}
                        placeholder="202410240001"
                        mono
                        size="sm"
                      />
                    </View>

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
                    </View>

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
                    </View>

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
                      3. VERIFICATION
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
  // MOBILE VIEW
  // -------------------------------------------------------------
  return (
    <View style={styles.mobileContainer}>
      <MobileSupervisorHeader dockName="Dock Bay 3" />

      {mobileTab === "dispatch" ? (
        <ScrollView
          style={styles.mobileScroll}
          contentContainerStyle={[
            styles.mobileScrollContent,
            {
              paddingBottom: 72 + insets.bottom,
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
          {gatePassIssued ? (
            <Pressable
              onPress={() => router.push("/(supervisor)/gate-pass" as any)}
              style={({ pressed }) => [
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
          ) : null}

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
        </ScrollView>
      ) : (
        /* RECENT TAB */
        <ScrollView
          style={styles.mobileScroll}
          contentContainerStyle={[
            styles.mobileScrollContent,
            {
              paddingBottom: 72 + insets.bottom,
            },
          ]}
        >
          <View style={styles.mobileHeaderBar}>
            <View>
              <Text
                variant="headlineMd"
                color={COLORS.textPrimary}
                style={styles.mobileTitle}
              >
                Recent Dispatches
              </Text>
            </View>
            <Badge
              label={`${recentLoads.length} Dispatched`}
              variant="default"
            />
          </View>

          <View style={styles.recentListContainer}>
            {recentLoads.map((load) => (
              <View key={load.id} style={styles.recentCard}>
                <View style={styles.recentCardHeader}>
                  <View style={styles.recentCardHeaderLeft}>
                    <Text
                      variant="tabularData"
                      color={COLORS.primary}
                      style={styles.recentLoadId}
                    >
                      {load.id}
                    </Text>
                    <Text variant="bodySm" color={COLORS.textMuted}>
                      •
                    </Text>
                    <Text variant="bodySm" color={COLORS.textSecondary}>
                      {load.dispatchTime}
                    </Text>
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

                <View style={styles.recentCardBody}>
                  <Text
                    variant="bodyMd"
                    color={COLORS.textPrimary}
                    style={styles.recentCustomerName}
                  >
                    {load.customerName}
                  </Text>
                  <View style={styles.recentMetaRow}>
                    <MaterialIcons
                      name="local-shipping"
                      size={13}
                      color={COLORS.textMuted}
                    />
                    <Text
                      variant="tabularData"
                      color={COLORS.textSecondary}
                      style={styles.recentMetaText}
                    >
                      {load.vehicleNumber}
                    </Text>
                    <Text variant="bodySm" color={COLORS.borderSubtle}>
                      •
                    </Text>
                    <MaterialIcons
                      name="person"
                      size={13}
                      color={COLORS.textMuted}
                    />
                    <Text variant="bodySm" color={COLORS.textSecondary}>
                      {load.driverName}
                    </Text>
                  </View>

                  <Text
                    variant="bodySm"
                    color={COLORS.textMuted}
                    style={styles.recentItemsSummary}
                    numberOfLines={2}
                  >
                    {load.itemsSummary}
                  </Text>
                </View>

                <View style={styles.recentCardFooter}>
                  <Pressable
                    onPress={() =>
                      router.push("/(supervisor)/gate-pass" as any)
                    }
                    style={({ pressed }) => [
                      styles.viewGatePassBtn,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.viewGatePassBtnLeft}>
                      <MaterialIcons
                        name="description"
                        size={14}
                        color={COLORS.primary}
                      />
                      <Text
                        variant="labelSm"
                        color={COLORS.primary}
                        style={styles.viewGatePassText}
                      >
                        View Digital Gate Pass
                      </Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={16}
                      color={COLORS.primary}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Fixed Supervisor Bottom Navigation */}
      <View
        style={[
          styles.supervisorBottomNav,
          { paddingBottom: Math.max(insets.bottom, 6) },
        ]}
      >
        <Pressable
          onPress={() => setMobileTab("dispatch")}
          style={[
            styles.supervisorNavTab,
            mobileTab === "dispatch" && styles.supervisorNavTabActive,
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: mobileTab === "dispatch" }}
        >
          <MaterialIcons
            name="local-shipping"
            size={22}
            color={mobileTab === "dispatch" ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            variant="labelSm"
            color={mobileTab === "dispatch" ? COLORS.primary : COLORS.textMuted}
            style={
              mobileTab === "dispatch"
                ? styles.supervisorNavTextActive
                : styles.supervisorNavText
            }
          >
            Dispatch
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMobileTab("recent")}
          style={[
            styles.supervisorNavTab,
            mobileTab === "recent" && styles.supervisorNavTabActive,
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: mobileTab === "recent" }}
        >
          <MaterialIcons
            name="history"
            size={22}
            color={mobileTab === "recent" ? COLORS.primary : COLORS.textMuted}
          />
          <Text
            variant="labelSm"
            color={mobileTab === "recent" ? COLORS.primary : COLORS.textMuted}
            style={
              mobileTab === "recent"
                ? styles.supervisorNavTextActive
                : styles.supervisorNavText
            }
          >
            Recent
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  gatePassToast: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceMd,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceMd,
    paddingVertical: SPACING.spaceSm + 2,
    marginBottom: SPACING.spaceXl,
  },
  gatePassToastContent: {
    flex: 1,
    gap: 2,
  },
  viewPassLink: {
    paddingHorizontal: SPACING.spaceSm,
    paddingVertical: 4,
  },
  desktopGrid: {
    flexDirection: "row",
    gap: SPACING.spaceXl,
    alignItems: "flex-start",
  },
  desktopMainForm: {
    flex: 8,
    gap: SPACING.spaceXl,
  },
  desktopSideMonitor: {
    flex: 4,
  },
  formSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.spaceLg,
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
    backgroundColor: COLORS.statusPaidText,
  },
  recentListContainer: {
    gap: SPACING.spaceSm + 2,
  },
  recentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: "hidden",
  },
  recentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm,
    backgroundColor: COLORS.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  recentCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recentLoadId: {
    fontSize: 13,
    fontWeight: "600",
  },
  recentCardBody: {
    padding: SPACING.spaceBase,
    gap: 6,
  },
  recentCustomerName: {
    fontSize: 14,
    fontWeight: "600",
  },
  recentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recentMetaText: {
    fontSize: 12,
  },
  recentItemsSummary: {
    fontSize: 12,
    lineHeight: 16,
  },
  recentCardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm,
  },
  viewGatePassBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewGatePassBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewGatePassText: {
    fontSize: 12,
    fontWeight: "600",
  },
  supervisorBottomNav: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    minHeight: 52,
  },
  supervisorNavTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 8,
  },
  supervisorNavTabActive: {
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
  },
  supervisorNavText: {
    fontSize: 11,
    fontWeight: "500",
  },
  supervisorNavTextActive: {
    fontSize: 11,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});
