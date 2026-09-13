/**
 * Gripwell - Screen 1: Office Billing Workspace
 * Desktop Reference: Office Billing Workspace (Minimal Desktop) - Stitch Screen 277895d51ac945119fb724804ed80334
 * Mobile Reference: Office Billing Workspace (Minimal Mobile) - Stitch Screen 571fca4b975448be9623664b25e6fc40
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdvanceOffsetStrip } from "../../components/domain/AdvanceOffsetStrip";
import { KPIStrip } from "../../components/domain/KPICard";
import { LineItemRow } from "../../components/domain/LineItemRow";
import { FileUploadDropzone } from "../../components/forms/FileUploadDropzone";
import { PaymentModeSelector } from "../../components/forms/PaymentModeSelector";
import { DesktopHeader } from "../../components/navigation/DesktopHeader";
import { RoleSwitcherPills } from "../../components/navigation/RoleSwitcherPills";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { TextInput } from "../../components/ui/TextInput";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import { useRoleContext } from "../../hooks/useRoleContext";
import {
  INITIAL_CONSIGNMENTS,
  INITIAL_KPIS,
} from "../../services/api/mockData";
import { Consignment, LineItem, PaymentMode } from "../../types/models";
import { formatINR } from "../../utils/currency";

type FilterTab = "all" | "pending" | "credit" | "advances";

export default function OfficeBillingWorkspace() {
  const { isDesktop, isMobile } = useResponsive();
  const insets = useSafeAreaInsets();
  const { activeRole } = useRoleContext();

  const [consignments, setConsignments] =
    useState<Consignment[]>(INITIAL_CONSIGNMENTS);
  const [selectedLoadId, setSelectedLoadId] = useState<string>("#1092");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [voidNotes, setVoidNotes] = useState<string>("");

  // Currently active selected consignment
  const activeConsignment =
    consignments.find((c) => c.id === selectedLoadId) || consignments[0];

  // Financial calculations
  const calculateGross = (items: LineItem[]) => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  };

  const grossTotal = calculateGross(activeConsignment.items);
  const appliedAdvance = activeConsignment.appliedAdvance;
  const netPayable = Math.max(0, grossTotal - appliedAdvance);

  // Line item mutation handlers
  const handleUpdateItemQty = (itemId: string, newQty: number) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== activeConsignment.id) return c;
        const updatedItems = c.items.map((it) =>
          it.id === itemId
            ? { ...it, quantity: newQty, total: newQty * it.unitPrice }
            : it,
        );
        const newGross = calculateGross(updatedItems);
        return {
          ...c,
          items: updatedItems,
          grossTotal: newGross,
          netPayable: Math.max(0, newGross - c.appliedAdvance),
        };
      }),
    );
  };

  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== activeConsignment.id) return c;
        const updatedItems = c.items.map((it) =>
          it.id === itemId
            ? { ...it, unitPrice: newPrice, total: it.quantity * newPrice }
            : it,
        );
        const newGross = calculateGross(updatedItems);
        return {
          ...c,
          items: updatedItems,
          grossTotal: newGross,
          netPayable: Math.max(0, newGross - c.appliedAdvance),
        };
      }),
    );
  };

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `li-${Date.now()}`,
      description: "Standard Freight Handling Box",
      sku: "GEN-BOX-01",
      unit: "Units",
      quantity: 1,
      unitPrice: 500,
      total: 500,
    };
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== activeConsignment.id) return c;
        const updatedItems = [...c.items, newItem];
        const newGross = calculateGross(updatedItems);
        return {
          ...c,
          items: updatedItems,
          grossTotal: newGross,
          netPayable: Math.max(0, newGross - c.appliedAdvance),
        };
      }),
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== activeConsignment.id) return c;
        const updatedItems = c.items.filter((it) => it.id !== itemId);
        const newGross = calculateGross(updatedItems);
        return {
          ...c,
          items: updatedItems,
          grossTotal: newGross,
          netPayable: Math.max(0, newGross - c.appliedAdvance),
        };
      }),
    );
  };

  // Advance offset handlers
  const handleApplyAdvance = (amount: number) => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== activeConsignment.id) return c;
        const effectiveAdvance = Math.min(amount, c.availableAdvance || 5000);
        return {
          ...c,
          appliedAdvance: effectiveAdvance,
          netPayable: Math.max(0, c.grossTotal - effectiveAdvance),
        };
      }),
    );
  };

  const handleRemoveAdvance = () => {
    setConsignments((prev) =>
      prev.map((c) => {
        if (c.id !== activeConsignment.id) return c;
        return {
          ...c,
          appliedAdvance: 0,
          netPayable: c.grossTotal,
        };
      }),
    );
  };

  // Payment mode handler
  const handleSelectPaymentMode = (mode: PaymentMode) => {
    setConsignments((prev) =>
      prev.map((c) =>
        c.id === activeConsignment.id ? { ...c, selectedPaymentMode: mode } : c,
      ),
    );
  };

  // Save to Ledger handler
  const handleSaveToLedger = () => {
    setSaveStatus("saved");
    setConsignments((prev) =>
      prev.map((c) =>
        c.id === activeConsignment.id ? { ...c, status: "settled" } : c,
      ),
    );
    setTimeout(() => {
      setSaveStatus("idle");
    }, 2000);
  };

  // Filtered consignments list
  const filteredConsignments = consignments.filter((c) => {
    if (activeFilter === "pending")
      return c.status === "uncalibrated" || c.status === "pending";
    if (activeFilter === "credit") return c.selectedPaymentMode === "credit";
    if (activeFilter === "advances")
      return c.appliedAdvance > 0 || c.availableAdvance > 0;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.customerName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.driverName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <View style={styles.safeArea}>
      {/* Desktop Header */}
      {isDesktop && (
        <DesktopHeader
          activeSection="billing"
          onSearchChange={setSearchQuery}
        />
      )}

      {/* Sticky Mobile/Tablet Header with Role Switcher */}
      {!isDesktop && (
        <View
          style={[
            styles.mobileTopBar,
            { paddingTop: Math.max(insets.top, 12) },
          ]}
        >
          {/* Top Role Switcher Row */}
          <View style={styles.mobileRoleRow}>
            <RoleSwitcherPills compact />
          </View>

          {/* Title & Quick Actions */}
          <View style={styles.mobileTitleRow}>
            <View style={{ flex: 1 }}>
              <Text
                variant="headlineSm"
                color={COLORS.textPrimary}
                style={{ fontWeight: "700" }}
              >
                Office Billing
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={{ fontSize: 11 }}
              >
                Reconcile settlements & calibrate rates
              </Text>
            </View>
            <Pressable
              onPress={() => router.replace("/(office)/credits" as any)}
              style={styles.mobileCreditsLink}
            >
              <MaterialIcons
                name="account-balance-wallet"
                size={14}
                color={COLORS.primary}
              />
              <Text
                variant="labelSm"
                style={{
                  color: COLORS.primary,
                  fontWeight: "600",
                  fontSize: 11,
                }}
              >
                Credit Ledger
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Desktop Page Title & Actions Strip */}
        {isDesktop && (
          <View style={styles.desktopWorkspaceHeader}>
            <View style={styles.desktopTitleRow}>
              <View>
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={styles.desktopSubtitle}
                >
                  FINANCE & TERMINAL OPERATIONS
                </Text>
                <Text variant="headlineLg" style={styles.desktopMainTitle}>
                  Office Billing & Settlement Ledger
                </Text>
              </View>

              <View style={styles.desktopHeaderControls}>
                <Pressable
                  onPress={() => router.replace("/(office)/credits" as any)}
                  style={styles.creditLedgerShortcut}
                >
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={15}
                    color={COLORS.secondary}
                  />
                  <Text
                    variant="labelSm"
                    style={{ color: COLORS.secondary, fontWeight: "600" }}
                  >
                    Credit & Advances
                  </Text>
                </Pressable>

                {/* Filter Tabs */}
                <View style={styles.desktopFilterTabs}>
                  <Pressable
                    onPress={() => setActiveFilter("all")}
                    style={[
                      styles.desktopTabPill,
                      activeFilter === "all" && styles.desktopTabPillActive,
                    ]}
                  >
                    <Text
                      variant="labelSm"
                      style={[
                        styles.desktopTabText,
                        activeFilter === "all" && styles.desktopTabTextActive,
                      ]}
                    >
                      All Customers ({consignments.length})
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setActiveFilter("pending")}
                    style={[
                      styles.desktopTabPill,
                      activeFilter === "pending" && styles.desktopTabPillActive,
                    ]}
                  >
                    <Text
                      variant="labelSm"
                      style={[
                        styles.desktopTabText,
                        activeFilter === "pending" &&
                          styles.desktopTabTextActive,
                      ]}
                    >
                      Pending Verification (1)
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setActiveFilter("credit")}
                    style={[
                      styles.desktopTabPill,
                      activeFilter === "credit" && styles.desktopTabPillActive,
                    ]}
                  >
                    <Text
                      variant="labelSm"
                      style={[
                        styles.desktopTabText,
                        activeFilter === "credit" &&
                          styles.desktopTabTextActive,
                      ]}
                    >
                      Credit Accounts (1)
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setActiveFilter("advances")}
                    style={[
                      styles.desktopTabPill,
                      activeFilter === "advances" &&
                        styles.desktopTabPillActive,
                    ]}
                  >
                    <Text
                      variant="labelSm"
                      style={[
                        styles.desktopTabText,
                        activeFilter === "advances" &&
                          styles.desktopTabTextActive,
                      ]}
                    >
                      Customer Advances
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Clean Flat KPI Row */}
            <KPIStrip summary={INITIAL_KPIS} isMobile={false} />
          </View>
        )}

        {/* Mobile Metrics Strip & Mobile Tabs */}
        {isMobile && (
          <View style={styles.mobileMetricsSection}>
            <KPIStrip summary={INITIAL_KPIS} isMobile={true} />

            {/* Underline Filter Tabs */}
            <View style={styles.mobileFilterTabs}>
              <Pressable
                onPress={() => setActiveFilter("all")}
                style={[
                  styles.mobileTab,
                  activeFilter === "all" && styles.mobileTabActive,
                ]}
              >
                <Text
                  variant="labelSm"
                  style={[
                    styles.mobileTabText,
                    activeFilter === "all" && styles.mobileTabTextActive,
                  ]}
                >
                  All ({consignments.length})
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveFilter("pending")}
                style={[
                  styles.mobileTab,
                  activeFilter === "pending" && styles.mobileTabActive,
                ]}
              >
                <Text
                  variant="labelSm"
                  style={[
                    styles.mobileTabText,
                    activeFilter === "pending" && styles.mobileTabTextActive,
                  ]}
                >
                  Pending (1)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveFilter("credit")}
                style={[
                  styles.mobileTab,
                  activeFilter === "credit" && styles.mobileTabActive,
                ]}
              >
                <Text
                  variant="labelSm"
                  style={[
                    styles.mobileTabText,
                    activeFilter === "credit" && styles.mobileTabTextActive,
                  ]}
                >
                  Credit (1)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveFilter("advances")}
                style={[
                  styles.mobileTab,
                  activeFilter === "advances" && styles.mobileTabActive,
                ]}
              >
                <Text
                  variant="labelSm"
                  style={[
                    styles.mobileTabText,
                    activeFilter === "advances" && styles.mobileTabTextActive,
                  ]}
                >
                  Advances
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Main Content Area */}
        <View
          style={
            isDesktop ? styles.desktopMainGrid : styles.mobileMainContainer
          }
        >
          {/* Left / Top: Consignments List */}
          <View
            style={isDesktop ? styles.desktopLeftCol : styles.mobileListSection}
          >
            <View style={styles.listHeaderRow}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.sectionHeaderTitle}
              >
                DOCK CUSTOMERS ({filteredConsignments.length})
              </Text>
              <Text variant="bodySm" color={COLORS.textMuted}>
                {isMobile ? "1 selected" : "Click to calibrate"}
              </Text>
            </View>

            <View style={styles.consignmentsList}>
              {filteredConsignments.map((item) => {
                const isSelected = item.id === activeConsignment.id;
                const isSettled = item.status === "settled";

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelectedLoadId(item.id)}
                    style={({ pressed }: any) => [
                      styles.consignmentItem,
                      isSelected && styles.consignmentItemSelected,
                      isDesktop &&
                        isSelected &&
                        styles.consignmentItemSelectedDesktop,
                      pressed && styles.itemPressed,
                    ]}
                  >
                    <View style={styles.itemTopRow}>
                      <View style={styles.itemMetaLeft}>
                        <Text variant="labelSm" style={styles.loadIdText}>
                          {item.id}
                        </Text>
                        <Text variant="bodySm" color="#CBD5E1">
                          ·
                        </Text>
                        <Text variant="bodySm" color={COLORS.textSecondary}>
                          {item.dockNumber}
                        </Text>
                        <Text variant="bodySm" color="#CBD5E1">
                          ·
                        </Text>
                        <Text variant="bodySm" color={COLORS.textSecondary}>
                          {item.driverName}
                        </Text>
                      </View>

                      <Badge
                        label={
                          item.status === "calibrating"
                            ? "Calibrating"
                            : item.status === "settled"
                              ? "Settled"
                              : item.status === "pending"
                                ? "Pending"
                                : "Uncalibrated"
                        }
                        variant={item.status}
                      />
                    </View>

                    <Text variant="bodyMd" style={styles.customerName}>
                      {item.customerName}
                    </Text>

                    <View style={styles.itemBottomRow}>
                      <Text
                        variant="bodySm"
                        color={COLORS.textSecondary}
                        numberOfLines={1}
                        style={styles.itemsSummary}
                      >
                        {item.itemsSummary}
                      </Text>
                      <Text
                        variant="tabularData"
                        style={[
                          styles.itemTotal,
                          item.grossTotal === 0 && styles.itemTotalEmpty,
                        ]}
                      >
                        {item.grossTotal > 0 ? formatINR(item.grossTotal) : "—"}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Right / Bottom: Clean Calibration Detail Panel */}
          <View
            style={
              isDesktop
                ? styles.desktopRightCol
                : styles.mobileCalibrationSection
            }
          >
            <View style={styles.detailCard}>
              {/* Panel Header */}
              <View style={styles.panelHeader}>
                <View>
                  <View style={styles.panelBreadcrumbs}>
                    <Text
                      variant="bodySm"
                      color={COLORS.textPrimary}
                      style={styles.loadRefText}
                    >
                      Load {activeConsignment.id}
                    </Text>
                    <Text variant="bodySm" color="#CBD5E1">
                      ·
                    </Text>
                    <Text variant="bodySm" color={COLORS.textSecondary}>
                      {activeConsignment.customerName}
                    </Text>
                    <Text variant="bodySm" color="#CBD5E1">
                      ·
                    </Text>
                    <Text variant="bodySm" color={COLORS.textMuted}>
                      Ref: {activeConsignment.referenceNumber}
                    </Text>
                  </View>
                  <Text variant="headlineSm" style={styles.panelTitle}>
                    Line Item Pricing & Settlement
                  </Text>
                </View>

                {isDesktop && (
                  <Pressable style={styles.closeBtn}>
                    <MaterialIcons
                      name="close"
                      size={18}
                      color={COLORS.textMuted}
                    />
                  </Pressable>
                )}
              </View>

              {/* Advance Application Strip */}
              <AdvanceOffsetStrip
                availableAmount={activeConsignment.availableAdvance || 5000}
                appliedAmount={appliedAdvance}
                voucherId={activeConsignment.advanceVoucherId || "ADV-1"}
                onApplyAdvance={handleApplyAdvance}
                onRemoveAdvance={handleRemoveAdvance}
                isMobile={isMobile}
              />

              {/* Line Items Section */}
              <View style={styles.lineItemsSection}>
                <View style={styles.lineItemsHeader}>
                  <Text
                    variant="labelSm"
                    color={COLORS.textSecondary}
                    style={styles.sectionHeaderTitle}
                  >
                    LINE ITEMS
                  </Text>
                  <Pressable onPress={handleAddItem} style={styles.addLineBtn}>
                    <MaterialIcons
                      name="add"
                      size={14}
                      color={COLORS.textPrimary}
                    />
                    <Text variant="labelSm" style={styles.addLineText}>
                      Add Line
                    </Text>
                  </Pressable>
                </View>

                {/* Table Header on Desktop */}
                {isDesktop && (
                  <View style={styles.tableHeaderRow}>
                    <View style={styles.colDesc}>
                      <Text variant="labelSm" color={COLORS.textMuted}>
                        Description
                      </Text>
                    </View>
                    <View style={styles.colQty}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textMuted}
                        style={styles.textRight}
                      >
                        Qty
                      </Text>
                    </View>
                    <View style={styles.colPrice}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textMuted}
                        style={styles.textRight}
                      >
                        Unit Price (₹)
                      </Text>
                    </View>
                    <View style={styles.colTotal}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textMuted}
                        style={styles.textRight}
                      >
                        Total
                      </Text>
                    </View>
                    <View style={styles.colDelete} />
                  </View>
                )}

                {/* Items List */}
                <View style={styles.itemsTableBody}>
                  {activeConsignment.items.map((it) => (
                    <LineItemRow
                      key={it.id}
                      item={it}
                      onChangeQty={(q) => handleUpdateItemQty(it.id, q)}
                      onChangePrice={(p) => handleUpdateItemPrice(it.id, p)}
                      onDelete={() => handleDeleteItem(it.id)}
                      isMobile={isMobile}
                    />
                  ))}
                </View>
              </View>

              {/* Financial Calculation Summary */}
              <View style={styles.financialSummary}>
                <View style={styles.summaryRow}>
                  <Text variant="bodySm" color={COLORS.textSecondary}>
                    Gross Total
                  </Text>
                  <Text variant="tabularData" style={styles.summaryVal}>
                    {formatINR(grossTotal)}
                  </Text>
                </View>

                {appliedAdvance > 0 && (
                  <View style={styles.summaryRow}>
                    <Text variant="bodySm" color={COLORS.textSecondary}>
                      Applied Advance (
                      {activeConsignment.advanceVoucherId || "ADV-1"})
                    </Text>
                    <Text
                      variant="tabularData"
                      color={COLORS.statusPaidFill}
                      style={styles.summaryVal}
                    >
                      - {formatINR(appliedAdvance)}
                    </Text>
                  </View>
                )}

                <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                  <Text variant="labelMd" style={styles.totalLabel}>
                    Net Balance Payable
                  </Text>
                  <Text variant="headlineSm" style={styles.totalVal}>
                    {formatINR(netPayable)}
                  </Text>
                </View>
              </View>

              {/* Payment Receipt Upload Dropzone */}
              <FileUploadDropzone isMobile={isMobile} />

              {/* Payment Mode Selection */}
              <View style={styles.paymentModeSection}>
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.sectionHeaderTitle}
                >
                  PAYMENT MODE
                </Text>
                <PaymentModeSelector
                  selectedMode={activeConsignment.selectedPaymentMode}
                  onSelectMode={handleSelectPaymentMode}
                  isMobile={isMobile}
                />
              </View>

              {/* Settlement Notes / Remarks Input */}
              <View style={styles.notesSection}>
                <TextInput
                  size="sm"
                  placeholder="settlement notes (optional)"
                  value={voidNotes}
                  onChangeText={setVoidNotes}
                />
              </View>

              {/* Footer Action Buttons */}
              <View
                style={[
                  styles.footerActions,
                  !isDesktop && styles.footerActionsMobile,
                ]}
              >
                {isDesktop ? (
                  <View style={styles.rightActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Print Pro-Forma"
                      onPress={() => alert("Printing Pro-Forma Invoice...")}
                    />

                    <Button
                      variant={saveStatus === "saved" ? "success" : "primary"}
                      size="sm"
                      title={
                        saveStatus === "saved"
                          ? "Saved to Ledger ✓"
                          : "Save to Ledger"
                      }
                      onPress={handleSaveToLedger}
                    />
                  </View>
                ) : (
                  <View style={styles.mobileSaveContainer}>
                    <Button
                      variant={saveStatus === "saved" ? "success" : "primary"}
                      size="md"
                      title={
                        saveStatus === "saved"
                          ? "Saved to Ledger ✓"
                          : "Save to Ledger"
                      }
                      onPress={handleSaveToLedger}
                      style={styles.saveButtonMobile}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mobileTopBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.spaceBase,
    paddingBottom: SPACING.spaceSm + 2,
    zIndex: 50,
  },
  mobileRoleRow: {
    marginBottom: 8,
  },
  mobileTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  mobileCreditsLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Desktop Page Header
  desktopWorkspaceHeader: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.space2xl,
    paddingTop: SPACING.spaceBase,
    paddingBottom: SPACING.spaceBase,
  },
  desktopTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.spaceBase,
  },
  desktopSubtitle: {
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  desktopMainTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  desktopHeaderControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceMd,
  },
  desktopFilterTabs: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: 2,
    gap: 2,
  },
  desktopTabPill: {
    paddingVertical: 5,
    paddingHorizontal: SPACING.spaceMd,
    borderRadius: RADIUS.xs,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  desktopTabPillActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  desktopTabText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  desktopTabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },

  // Desktop Main Grid (Col 5 left, Col 7 right)
  desktopMainGrid: {
    flexDirection: "row",
    paddingHorizontal: SPACING.space2xl,
    paddingVertical: SPACING.spaceLg,
    gap: SPACING.space2xl,
    alignItems: "flex-start",
  },
  desktopLeftCol: {
    flex: 5,
  },
  desktopRightCol: {
    flex: 7,
  },

  // Mobile Layout
  mobileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceBase,
    paddingTop: SPACING.spaceLg,
    paddingBottom: SPACING.spaceSm,
  },
  mobileTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  mobileHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
  },
  mobileMetricsSection: {
    paddingHorizontal: SPACING.spaceBase,
    paddingBottom: SPACING.spaceSm,
  },
  mobileFilterTabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceBase,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginTop: SPACING.spaceSm,
  },
  mobileTab: {
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  mobileTabActive: {
    borderBottomColor: COLORS.primary,
  },
  mobileTabText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  mobileTabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  mobileMainContainer: {
    paddingHorizontal: SPACING.spaceBase,
    gap: SPACING.spaceLg,
  },
  mobileListSection: {
    gap: SPACING.spaceSm,
  },
  mobileCalibrationSection: {
    paddingTop: SPACING.spaceSm,
  },

  // Customer List Rows
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: SPACING.spaceSm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeaderTitle: {
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  consignmentsList: {
    gap: 4,
    marginTop: SPACING.spaceXs,
  },
  consignmentItem: {
    paddingVertical: SPACING.spaceMd,
    paddingHorizontal: SPACING.spaceSm,
    borderRadius: RADIUS.sm,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    ...Platform.select({
      web: {
        cursor: "pointer",
        transitionProperty: "background-color, border-color",
        transitionDuration: "120ms",
      },
    }),
  },
  consignmentItemSelected: {
    backgroundColor: "#F8FAFC",
  },
  consignmentItemSelectedDesktop: {
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },
  itemPressed: {
    opacity: 0.85,
  },
  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  loadIdText: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  itemBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  itemsSummary: {
    flex: 1,
    marginRight: SPACING.spaceSm,
  },
  itemTotal: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  itemTotalEmpty: {
    color: COLORS.textMuted,
  },

  // Calibration Detail Panel
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.spaceLg,
    gap: SPACING.spaceLg,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingBottom: SPACING.spaceMd,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  panelBreadcrumbs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  loadRefText: {
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  panelTitle: {
    marginTop: 4,
  },
  closeBtn: {
    padding: 2,
  },

  // Line items
  lineItemsSection: {
    gap: SPACING.spaceSm,
  },
  lineItemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addLineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  addLineText: {
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: SPACING.spaceXs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  colDesc: {
    flex: 1,
  },
  colQty: {
    width: 80,
    paddingHorizontal: 6,
  },
  colPrice: {
    width: 100,
    paddingHorizontal: 6,
  },
  colTotal: {
    width: 110,
    paddingRight: SPACING.spaceSm,
  },
  colDelete: {
    width: 32,
  },
  textRight: {
    textAlign: "right",
  },
  itemsTableBody: {
    gap: 2,
  },

  // Financial summary
  financialSummary: {
    paddingTop: SPACING.spaceMd,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryVal: {
    color: COLORS.textPrimary,
  },
  summaryRowTotal: {
    paddingTop: SPACING.spaceSm,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  // Payment mode
  paymentModeSection: {
    gap: SPACING.spaceSm,
  },

  // Notes
  notesSection: {
    marginTop: -4,
  },

  // Footer Actions
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: SPACING.spaceBase,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerActionsMobile: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  mobileSaveContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonMobile: {
    minWidth: 220,
    maxWidth: 280,
    width: "100%",
    alignSelf: "center",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
  },
  creditLedgerShortcut: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#EFF6FF",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
});
