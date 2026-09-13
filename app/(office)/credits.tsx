/**
 * Gripwell - Office Finance: Credit Ledger & Customer Advances
 * Implementation of Google Stitch Screen 9 (edd10a6def0445efb812fd869ef0800b).
 *
 * Supports Mobile and Desktop adaptive layouts with:
 * - 4-Card Financial KPI header with progress bars
 * - Credit Accounts Ledger with particulars, vehicle specs, and advance offset strip
 * - Customer Advance Deposits with 3-box balance meters and applied mapping trail
 * - Split Payment & Credit Settlement Modal (#settleModal)
 * - Record Advance Payment Slide-over Drawer (#advanceDrawer)
 * - Complete responsive navigation with Office Billing and Role Switcher
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdvanceDepositCard } from "../../components/domain/AdvanceDepositCard";
import { CreditKPIHeader } from "../../components/domain/CreditKPIHeader";
import { CreditLoadCard } from "../../components/domain/CreditLoadCard";
import { RecordAdvanceDrawer } from "../../components/domain/RecordAdvanceDrawer";
import { SettleCreditModal } from "../../components/domain/SettleCreditModal";
import { RoleSwitcherPills } from "../../components/navigation/RoleSwitcherPills";
import { Text } from "../../components/ui/Text";
import { COLORS } from "../../constants/colors";
import {
  INITIAL_ADVANCE_DEPOSITS,
  INITIAL_CREDIT_KPIS,
  INITIAL_CREDIT_LOADS,
} from "../../constants/mockCreditLedger";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import { useRoleContext } from "../../hooks/useRoleContext";
import {
  AdvanceDepositItem,
  CreditLedgerItem,
  CreditLedgerKPISummary,
} from "../../types/models";

export default function CreditLedgerScreen() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { isDesktop, width } = useResponsive();
  const { staff, terminalHub, setActiveRole } = useRoleContext();

  const [kpis, setKpis] = useState<CreditLedgerKPISummary>(INITIAL_CREDIT_KPIS);
  const [creditLoads, setCreditLoads] =
    useState<CreditLedgerItem[]>(INITIAL_CREDIT_LOADS);
  const [advanceDeposits, setAdvanceDeposits] = useState<AdvanceDepositItem[]>(
    INITIAL_ADVANCE_DEPOSITS,
  );

  // Active view tab for mobile handheld and desktop indicator
  const [mobileTab, setMobileTab] = useState<"credits" | "advances">(
    pathname?.toLowerCase().includes("advance") ? "advances" : "credits",
  );

  useEffect(() => {
    if (pathname?.toLowerCase().includes("advance")) {
      setMobileTab("advances");
    } else if (pathname?.toLowerCase().includes("credit")) {
      setMobileTab("credits");
    }
  }, [pathname]);

  // Settlement Modal State
  const [settleModalVisible, setSettleModalVisible] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<CreditLedgerItem | null>(
    null,
  );
  const [autoApplyAdvance, setAutoApplyAdvance] = useState(false);

  // Advance Drawer State
  const [advanceDrawerVisible, setAdvanceDrawerVisible] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handlers
  const handleOpenSettle = (item: CreditLedgerItem, autoApply = false) => {
    setSelectedLoad(item);
    setAutoApplyAdvance(autoApply);
    setSettleModalVisible(true);
  };

  const handleConfirmClearance = (
    item: CreditLedgerItem,
    offsetApplied: number,
    remainingPaid: number,
    mode: string,
  ) => {
    // 1. Update Load Status
    setCreditLoads((prev) =>
      prev.map((l) => {
        if (l.id === item.id) {
          return {
            ...l,
            settled: l.settled + offsetApplied + remainingPaid,
            netDue: 0,
            statusTag: "Settled",
            availableAdvance: 0,
          };
        }
        return l;
      }),
    );

    // 2. If advance was offset, deduct from matching customer advance
    if (offsetApplied > 0) {
      setAdvanceDeposits((prev) =>
        prev.map((adv) => {
          if (
            adv.customerName
              .toLowerCase()
              .includes(item.customerName.toLowerCase()) ||
            adv.id === "ADV-1"
          ) {
            const newApplied = adv.applied + offsetApplied;
            const newRemaining = Math.max(0, adv.remaining - offsetApplied);
            return {
              ...adv,
              applied: newApplied,
              remaining: newRemaining,
              status:
                newRemaining === 0 ? "Fully Allocated" : "Partially Allocated",
            };
          }
          return adv;
        }),
      );
    }

    // 3. Update KPIs
    setKpis((prev) => {
      const recoveredDelta = offsetApplied + remainingPaid;
      const newOutstanding = Math.max(
        0,
        prev.netOutstandingCredit - recoveredDelta,
      );
      const newAdvanceHeld =
        offsetApplied > 0
          ? Math.max(0, prev.totalAdvanceBalanceHeld - offsetApplied)
          : prev.totalAdvanceBalanceHeld;
      return {
        ...prev,
        totalRecovered: prev.totalRecovered + recoveredDelta,
        recoveredPercentage: `${Math.round(((prev.totalRecovered + recoveredDelta) / prev.totalCreditGiven) * 100)}% recovered`,
        netOutstandingCredit: newOutstanding,
        criticalStatus: newOutstanding === 0 ? "Cleared" : "Critical",
        totalAdvanceBalanceHeld: newAdvanceHeld,
        unmappedPool: `₹${newAdvanceHeld.toLocaleString()} liquid`,
      };
    });

    showToast(
      `${item.loadNumber} (${item.customerName}) marked as Settled. Ledger updated via ${mode}.`,
    );
  };

  const handleSaveAdvanceDeposit = (newDeposit: AdvanceDepositItem) => {
    setAdvanceDeposits((prev) => [newDeposit, ...prev]);
    setKpis((prev) => {
      const updatedBalance =
        prev.totalAdvanceBalanceHeld + newDeposit.totalAdvance;
      return {
        ...prev,
        totalAdvanceBalanceHeld: updatedBalance,
        unmappedPool: `₹${updatedBalance.toLocaleString()} liquid`,
      };
    });
    showToast(
      `Advance deposit of ₹${newDeposit.totalAdvance.toLocaleString()} recorded for ${newDeposit.customerName} (${newDeposit.id}).`,
    );
  };

  const handleGenerateMemo = (item: CreditLedgerItem) => {
    const memoText = `DEBIT MEMO #${item.tripId}: ${item.customerName} - Net Due ₹${item.netDue.toLocaleString()} (${item.route})`;
    if (Platform.OS === "web") {
      showToast(memoText);
    } else {
      Alert.alert("Debit Memo Generated", memoText);
    }
  };

  // -------------------------------------------------------------
  // DESKTOP VIEW (Match Stitch Screen 9)
  // -------------------------------------------------------------
  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Desktop Sticky Header */}
        <View style={styles.desktopTopHeader}>
          {/* Left: Brand & Nav Tabs */}
          <View style={styles.desktopHeaderLeft}>
            <Pressable
              onPress={() => router.replace("/(office)/billing" as any)}
              style={styles.brandGroup}
              accessibilityRole="link"
            >
              <View style={styles.brandIcon}>
                <MaterialIcons
                  name="local-shipping"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <Text variant="headlineSm" style={styles.brandTitle}>
                Gripwell
              </Text>
            </Pressable>

            <View style={styles.headerDivider} />

            {/* Top Nav Links */}
            <View style={styles.desktopNavTabs}>
              <Pressable
                onPress={() => {
                  setActiveRole("supervisor");
                  router.replace("/(supervisor)/dispatch" as any);
                }}
                style={styles.navTab}
                accessibilityRole="link"
              >
                <Text variant="labelMd" color={COLORS.textSecondary}>
                  Dispatch
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setMobileTab("credits");
                  router.replace("/(office)/credits" as any);
                }}
                style={[
                  styles.navTab,
                  mobileTab === "credits" && styles.navTabActive,
                ]}
                accessibilityRole="link"
                accessibilityState={{ selected: mobileTab === "credits" }}
              >
                <Text
                  variant="labelMd"
                  style={
                    mobileTab === "credits"
                      ? styles.navTabActiveText
                      : { color: COLORS.textSecondary }
                  }
                >
                  Credit Ledger
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setMobileTab("advances");
                  router.replace("/(office)/advances" as any);
                }}
                style={[
                  styles.navTab,
                  mobileTab === "advances" && styles.navTabActive,
                ]}
                accessibilityRole="link"
                accessibilityState={{ selected: mobileTab === "advances" }}
              >
                <Text
                  variant="labelMd"
                  style={
                    mobileTab === "advances"
                      ? styles.navTabActiveText
                      : { color: COLORS.textSecondary }
                  }
                >
                  Advance Payments
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Center: Role Switcher */}
          <View style={styles.desktopRoleCenter}>
            <RoleSwitcherPills compact />
          </View>

          {/* Right: Operational Status, Notifications & Profile */}
          <View style={styles.desktopHeaderRight}>
            <View style={styles.statusPillsCluster}>
              <View style={styles.pendingPill}>
                <View
                  style={[styles.miniDot, { backgroundColor: "#D97706" }]}
                />
                <Text
                  variant="labelSm"
                  style={{ color: "#92400E", fontWeight: "600" }}
                >
                  14 Pending
                </Text>
              </View>
              <View style={styles.activePill}>
                <View
                  style={[styles.miniDot, { backgroundColor: "#059669" }]}
                />
                <Text
                  variant="labelSm"
                  style={{ color: "#065F46", fontWeight: "600" }}
                >
                  48 Active
                </Text>
              </View>
              <View style={styles.billedPill}>
                <View
                  style={[styles.miniDot, { backgroundColor: "#2563EB" }]}
                />
                <Text
                  variant="labelSm"
                  style={{ color: "#1D4ED8", fontWeight: "600" }}
                >
                  ₹184.2k Billed
                </Text>
              </View>
            </View>

            <View style={styles.headerDivider} />

            <View style={styles.hubIndicator}>
              <View style={styles.hubDot} />
              <Text variant="bodySm" color={COLORS.textSecondary}>
                {terminalHub}
              </Text>
            </View>

            <View style={styles.profileBadge}>
              <Text variant="labelSm" style={styles.profileInitials}>
                {staff.initials}
              </Text>
            </View>
          </View>
        </View>

        {/* Desktop Main Content */}
        <ScrollView
          style={styles.desktopScroll}
          contentContainerStyle={styles.desktopScrollContent}
        >
          <View style={styles.desktopMaxContainer}>
            {/* Toast Confirmation */}
            {toastMessage && (
              <View style={styles.toastBanner}>
                <MaterialIcons name="check-circle" size={16} color="#059669" />
                <Text variant="bodySm" style={styles.toastText}>
                  {toastMessage}
                </Text>
              </View>
            )}

            {/* Page Header & Actions */}
            <View style={styles.pageHeaderSection}>
              <View>
                <View style={styles.breadcrumbRow}>
                  <Text variant="labelSm" style={styles.breadcrumbText}>
                    FINANCIAL OPERATIONS
                  </Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={13}
                    color={COLORS.textMuted}
                  />
                  <Text variant="labelSm" style={styles.breadcrumbActive}>
                    RECONCILIATION CORE
                  </Text>
                </View>
                <Text variant="headlineLg" style={styles.pageTitle}>
                  Credit Ledger & Customer Advances
                </Text>
                <Text
                  variant="bodyMd"
                  color={COLORS.textSecondary}
                  style={{ marginTop: 2 }}
                >
                  Real-time receivables monitoring, credit risk allocation, and
                  pre-funded trip balances.
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.headerActionBtns}>
                <Pressable
                  onPress={() => {
                    const firstDue =
                      creditLoads.find((l) => l.netDue > 0) || creditLoads[0];
                    handleOpenSettle(firstDue, false);
                  }}
                  style={({ pressed }: any) => [
                    styles.settleActionBtn,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                >
                  <MaterialIcons
                    name="check-circle"
                    size={18}
                    color={COLORS.textPrimary}
                  />
                  <Text variant="labelMd" style={{ fontWeight: "600" }}>
                    Settle Credit
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setAdvanceDrawerVisible(true)}
                  style={({ pressed }: any) => [
                    styles.recordAdvanceBtn,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                >
                  <MaterialIcons name="add" size={18} color="#FFFFFF" />
                  <Text
                    variant="labelMd"
                    style={{ color: "#FFFFFF", fontWeight: "600" }}
                  >
                    Record New Advance
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* 4 Financial KPI Metric Cards */}
            <CreditKPIHeader kpis={kpis} isDesktop={true} />

            {/* 2-Column Split Pane (7 cols / 5 cols) */}
            <View style={styles.splitGrid}>
              {/* Left Column (7 cols): Credit Accounts Ledger */}
              <View style={styles.leftCol}>
                <View style={styles.sectionHeadingRow}>
                  <View style={styles.sectionHeadingLeft}>
                    <View style={styles.sectionDot} />
                    <Text variant="headlineSm" style={styles.sectionTitle}>
                      Credit Accounts Ledger
                    </Text>
                    <View style={styles.pendingBadge}>
                      <Text variant="labelSm" style={styles.pendingBadgeText}>
                        {
                          creditLoads.filter((l) => l.statusTag !== "Settled")
                            .length
                        }{" "}
                        Loads Pending
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sectionIcons}>
                    <Pressable style={styles.iconBtn}>
                      <MaterialIcons
                        name="filter-list"
                        size={18}
                        color={COLORS.textSecondary}
                      />
                    </Pressable>
                    <Pressable style={styles.iconBtn}>
                      <MaterialIcons
                        name="tune"
                        size={18}
                        color={COLORS.textSecondary}
                      />
                    </Pressable>
                  </View>
                </View>

                {/* Credit Load Cards */}
                {creditLoads.map((item) => (
                  <CreditLoadCard
                    key={item.id}
                    item={item}
                    onSettle={handleOpenSettle}
                    onGenerateMemo={handleGenerateMemo}
                  />
                ))}
              </View>

              {/* Right Column (5 cols): Customer Advance Deposits */}
              <View style={styles.rightCol}>
                <View style={styles.sectionHeadingRow}>
                  <View style={styles.sectionHeadingLeft}>
                    <View
                      style={[
                        styles.sectionDot,
                        { backgroundColor: COLORS.secondary },
                      ]}
                    />
                    <Text variant="headlineSm" style={styles.sectionTitle}>
                      Customer Advance Deposits
                    </Text>
                    <View style={styles.reserveBadge}>
                      <Text variant="labelSm" style={styles.reserveBadgeText}>
                        Active Reserve
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => setAdvanceDrawerVisible(true)}
                    style={styles.newDepositBtn}
                  >
                    <MaterialIcons
                      name="add-circle"
                      size={16}
                      color={COLORS.secondary}
                    />
                    <Text variant="labelSm" style={styles.newDepositText}>
                      New Deposit
                    </Text>
                  </Pressable>
                </View>

                {/* Advance Deposit Cards */}
                {advanceDeposits.map((dep) => (
                  <AdvanceDepositCard
                    key={dep.id}
                    deposit={dep}
                    onAssignToLoad={(d) => {
                      const firstDue =
                        creditLoads.find((l) => l.netDue > 0) || creditLoads[0];
                      handleOpenSettle(firstDue, true);
                    }}
                  />
                ))}

                {/* Automated Re-Credits Guarantee Banner */}
                <View style={styles.guaranteeBanner}>
                  <View style={styles.guaranteeHeader}>
                    <MaterialIcons
                      name="shield"
                      size={18}
                      color={COLORS.secondary}
                    />
                    <Text variant="labelMd" style={styles.guaranteeTitle}>
                      Automated Re-Credits Guarantee
                    </Text>
                  </View>
                  <Text
                    variant="bodySm"
                    color={COLORS.textSecondary}
                    style={{ marginTop: 2 }}
                  >
                    Unmapped balances automatically offset overdue invoices
                    across related tax IDs after 48 business hours.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Split Payment Modal */}
        <SettleCreditModal
          visible={settleModalVisible}
          item={selectedLoad}
          initialApplyAdvance={autoApplyAdvance}
          onClose={() => setSettleModalVisible(false)}
          onConfirmClearance={handleConfirmClearance}
        />

        {/* Record Advance Drawer */}
        <RecordAdvanceDrawer
          visible={advanceDrawerVisible}
          onClose={() => setAdvanceDrawerVisible(false)}
          onSaveDeposit={handleSaveAdvanceDeposit}
          isDesktop={true}
        />
      </View>
    );
  }

  // -------------------------------------------------------------
  // MOBILE VIEW (Handheld Responsive View)
  // -------------------------------------------------------------
  return (
    <View style={styles.mobileContainer}>
      {/* Sticky Mobile Header */}
      <View
        style={[styles.mobileTopBar, { paddingTop: Math.max(insets.top, 10) }]}
      >
        <View style={styles.mobileRoleRow}>
          <RoleSwitcherPills compact />
        </View>

        <View style={styles.mobileHeaderRow}>
          <View style={styles.mobileHeaderLeft}>
            <MaterialIcons
              name="receipt-long"
              size={20}
              color={COLORS.primary}
            />
            <Text variant="headlineSm" style={styles.mobileHeaderTitle}>
              Credit & Advances
            </Text>
          </View>

          <View style={styles.mobileHeaderRight}>
            <Pressable
              onPress={() => router.replace("/(office)/billing")}
              style={styles.mobileBillingLink}
            >
              <MaterialIcons
                name="receipt"
                size={16}
                color={COLORS.secondary}
              />
              <Text
                variant="labelSm"
                color={COLORS.secondary}
                style={{ fontWeight: "600" }}
              >
                Billing
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Mobile Tab Segment */}
        <View style={styles.mobileSegmentRow}>
          <Pressable
            onPress={() => setMobileTab("credits")}
            style={[
              styles.mobileSegmentTab,
              mobileTab === "credits" && styles.mobileSegmentTabActive,
            ]}
          >
            <Text
              variant="labelSm"
              style={[
                styles.mobileSegmentText,
                mobileTab === "credits" && styles.mobileSegmentTextActive,
              ]}
            >
              Credit Ledger (
              {creditLoads.filter((l) => l.statusTag !== "Settled").length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setMobileTab("advances")}
            style={[
              styles.mobileSegmentTab,
              mobileTab === "advances" && styles.mobileSegmentTabActive,
            ]}
          >
            <Text
              variant="labelSm"
              style={[
                styles.mobileSegmentText,
                mobileTab === "advances" && styles.mobileSegmentTextActive,
              ]}
            >
              Advances Pool ({advanceDeposits.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Main Mobile Scroll Content */}
      <ScrollView
        style={styles.mobileScroll}
        contentContainerStyle={[
          styles.mobileScrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <View style={styles.toastBanner}>
            <MaterialIcons name="check-circle" size={16} color="#059669" />
            <Text variant="bodySm" style={styles.toastText}>
              {toastMessage}
            </Text>
          </View>
        )}

        {/* Subtitle & Quick Actions */}
        <View style={styles.mobileSubHeader}>
          <Text variant="headlineSm" style={styles.mobileSubTitle}>
            {mobileTab === "credits"
              ? "Credit Accounts & Aging Ledger"
              : "Pre-Funded Customer Advances"}
          </Text>
          <Text variant="bodySm" color={COLORS.textSecondary}>
            {mobileTab === "credits"
              ? "Receivables monitoring, debt risk allocation & settlement."
              : "Unallocated customer deposits for automated line deduction."}
          </Text>

          <View style={styles.mobileActionButtons}>
            <Pressable
              onPress={() => {
                const firstDue =
                  creditLoads.find((l) => l.netDue > 0) || creditLoads[0];
                handleOpenSettle(firstDue, false);
              }}
              style={({ pressed }: any) => [
                styles.mobileSettleBtn,
                pressed && styles.pressed,
              ]}
            >
              <MaterialIcons name="check-circle" size={16} color="#FFFFFF" />
              <Text
                variant="labelMd"
                style={{ color: "#FFFFFF", fontWeight: "600" }}
              >
                Settle Credit
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setAdvanceDrawerVisible(true)}
              style={({ pressed }: any) => [
                styles.mobileAdvanceBtn,
                pressed && styles.pressed,
              ]}
            >
              <MaterialIcons name="add" size={16} color={COLORS.textPrimary} />
              <Text
                variant="labelMd"
                style={{ color: COLORS.textPrimary, fontWeight: "600" }}
              >
                New Deposit
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 4 Financial KPIs */}
        <CreditKPIHeader kpis={kpis} isDesktop={false} />

        {/* Selected Tab Content */}
        {mobileTab === "credits" ? (
          <View style={{ gap: SPACING.spaceSm }}>
            <View style={styles.mobileSectionHead}>
              <Text
                variant="labelMd"
                style={{ fontWeight: "700", color: COLORS.textPrimary }}
              >
                Active Credit Invoices
              </Text>
              <Text variant="labelSm" color={COLORS.textMuted}>
                {creditLoads.length} Consignments Recorded
              </Text>
            </View>

            {creditLoads.map((item) => (
              <CreditLoadCard
                key={item.id}
                item={item}
                onSettle={handleOpenSettle}
                onGenerateMemo={handleGenerateMemo}
              />
            ))}
          </View>
        ) : (
          <View style={{ gap: SPACING.spaceSm }}>
            <View style={styles.mobileSectionHead}>
              <Text
                variant="labelMd"
                style={{ fontWeight: "700", color: COLORS.textPrimary }}
              >
                Customer Advance Deposits
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.secondary}
                style={{ fontWeight: "600" }}
              >
                Active Reserves
              </Text>
            </View>

            {advanceDeposits.map((dep) => (
              <AdvanceDepositCard
                key={dep.id}
                deposit={dep}
                onAssignToLoad={() => {
                  const firstDue =
                    creditLoads.find((l) => l.netDue > 0) || creditLoads[0];
                  handleOpenSettle(firstDue, true);
                }}
              />
            ))}

            {/* Guarantee Banner */}
            <View style={styles.guaranteeBanner}>
              <View style={styles.guaranteeHeader}>
                <MaterialIcons
                  name="shield"
                  size={18}
                  color={COLORS.secondary}
                />
                <Text variant="labelMd" style={styles.guaranteeTitle}>
                  Automated Re-Credits Guarantee
                </Text>
              </View>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={{ marginTop: 2 }}
              >
                Unmapped balances automatically offset overdue invoices across
                related tax IDs after 48 business hours.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Settlement Modal */}
      <SettleCreditModal
        visible={settleModalVisible}
        item={selectedLoad}
        initialApplyAdvance={autoApplyAdvance}
        onClose={() => setSettleModalVisible(false)}
        onConfirmClearance={handleConfirmClearance}
      />

      {/* Record Advance Drawer */}
      <RecordAdvanceDrawer
        visible={advanceDrawerVisible}
        onClose={() => setAdvanceDrawerVisible(false)}
        onSaveDeposit={handleSaveAdvanceDeposit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // -------------------------------------------------------------
  // DESKTOP STYLES
  // -------------------------------------------------------------
  desktopContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  desktopTopHeader: {
    height: SPACING.headerHeight,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceXl,
  },
  desktopHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceBase,
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
  },
  desktopNavTabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceBase,
  },
  navTab: {
    paddingVertical: 18,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  navTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  navTabActiveText: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  desktopRoleCenter: {
    width: 320,
    marginHorizontal: SPACING.spaceBase,
    alignItems: "center",
    justifyContent: "center",
  },
  desktopHeaderRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceBase,
  },
  statusPillsCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pendingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  billedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  hubIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hubDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  profileBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitials: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  desktopScroll: {
    flex: 1,
  },
  desktopScrollContent: {
    paddingVertical: SPACING.spaceXl,
    paddingHorizontal: SPACING.spaceXl,
    alignItems: "center",
  },
  desktopMaxContainer: {
    width: "100%",
    maxWidth: 1280,
  },
  pageHeaderSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: SPACING.spaceLg,
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  breadcrumbText: {
    color: COLORS.secondary,
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  breadcrumbActive: {
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  headerActionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
  },
  settleActionBtn: {
    height: 38,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.md,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  recordAdvanceBtn: {
    height: 38,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  splitGrid: {
    flexDirection: "row",
    gap: SPACING.spaceXl,
  },
  leftCol: {
    flex: 7,
  },
  rightCol: {
    flex: 5,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.spaceBase,
  },
  sectionHeadingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  pendingBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  pendingBadgeText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  reserveBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  reserveBadgeText: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
  sectionIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    padding: 6,
    borderRadius: RADIUS.xs,
  },
  newDepositBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  newDepositText: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
  guaranteeBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: RADIUS.lg,
    padding: SPACING.spaceBase,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginTop: SPACING.spaceSm,
  },
  guaranteeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.secondary,
  },

  // -------------------------------------------------------------
  // MOBILE STYLES
  // -------------------------------------------------------------
  mobileContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mobileTopBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.spaceBase,
    paddingBottom: SPACING.spaceSm,
    zIndex: 10,
    ...Platform.select({
      web: {
        position: "sticky" as any,
        top: 0,
      },
    }),
  },
  mobileRoleRow: {
    alignItems: "center",
    marginBottom: 6,
  },
  mobileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mobileHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mobileHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  mobileHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mobileBillingLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#EFF6FF",
    borderRadius: RADIUS.xs,
  },
  mobileSegmentRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.sm,
    padding: 2,
  },
  mobileSegmentTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.xs,
  },
  mobileSegmentTabActive: {
    backgroundColor: COLORS.surface,
    ...Platform.select({
      web: { boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
      default: { elevation: 1 },
    }),
  },
  mobileSegmentText: {
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  mobileSegmentTextActive: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  mobileScroll: {
    flex: 1,
  },
  mobileScrollContent: {
    paddingHorizontal: SPACING.spaceBase,
    paddingTop: SPACING.spaceBase,
  },
  mobileSubHeader: {
    marginBottom: SPACING.spaceBase,
  },
  mobileSubTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  mobileActionButtons: {
    flexDirection: "row",
    gap: SPACING.spaceSm,
    marginTop: SPACING.spaceSm + 2,
  },
  mobileSettleBtn: {
    flex: 1,
    height: 36,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  mobileAdvanceBtn: {
    flex: 1,
    height: 36,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  mobileSectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: SPACING.spaceSm + 2,
  },
  toastText: {
    color: "#065F46",
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.85,
  },
});
