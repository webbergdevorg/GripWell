/**
 * Gripwell - Office Finance: Credit Accounts Ledger
 * Compact, information-dense table layout (desktop) and compact cards (mobile).
 * Stable shell integration via OfficeWorkspaceShell.
 */

import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { CreditKPIHeader } from "../../components/domain/CreditKPIHeader";
import { RecordAdvanceDrawer } from "../../components/domain/RecordAdvanceDrawer";
import { SettleCreditModal } from "../../components/domain/SettleCreditModal";
import { OfficeWorkspaceShell } from "../../components/navigation/OfficeWorkspaceShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { TextInput } from "../../components/ui/TextInput";
import { COLORS } from "../../constants/colors";
import {
  INITIAL_ADVANCE_DEPOSITS,
  INITIAL_CREDIT_KPIS,
  INITIAL_CREDIT_LOADS,
} from "../../constants/mockCreditLedger";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import {
  AdvanceDepositItem,
  CreditLedgerItem,
  CreditLedgerKPISummary,
} from "../../types/models";

export default function CreditLedgerScreen() {
  const { isDesktop } = useResponsive();

  const [kpis, setKpis] = useState<CreditLedgerKPISummary>(INITIAL_CREDIT_KPIS);
  const [creditLoads, setCreditLoads] =
    useState<CreditLedgerItem[]>(INITIAL_CREDIT_LOADS);
  const [advanceDeposits, setAdvanceDeposits] = useState<AdvanceDepositItem[]>(
    INITIAL_ADVANCE_DEPOSITS,
  );

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "overdue" | "partial" | "settled"
  >("all");

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

    // 3. Update summary KPIs
    setKpis((prev) => ({
      ...prev,
      netOutstandingCredit: Math.max(
        0,
        prev.netOutstandingCredit - item.netDue,
      ),
      totalRecovered: prev.totalRecovered + offsetApplied + remainingPaid,
      activeDebitsCount: Math.max(0, prev.activeDebitsCount - 1),
    }));

    setSettleModalVisible(false);
    showToast(
      `Settled ${item.loadNumber} for ${item.customerName}. Cleared ₹${item.netDue.toLocaleString()}`,
    );
  };

  // Counts
  const overdueCount = creditLoads.filter(
    (l) => l.statusTag === "Overdue Alert",
  ).length;
  const partialCount = creditLoads.filter(
    (l) => l.statusTag === "Partial Paid",
  ).length;
  const settledCount = creditLoads.filter(
    (l) => l.statusTag === "Settled",
  ).length;

  // Filtered rows
  const filteredLoads = creditLoads.filter((l) => {
    if (activeFilter === "overdue" && l.statusTag !== "Overdue Alert")
      return false;
    if (activeFilter === "partial" && l.statusTag !== "Partial Paid")
      return false;
    if (activeFilter === "settled" && l.statusTag !== "Settled") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.customerName.toLowerCase().includes(q) ||
        l.loadNumber.toLowerCase().includes(q) ||
        l.vehicleReg.toLowerCase().includes(q) ||
        l.particulars.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <OfficeWorkspaceShell
      activeTab="credits"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search by customer, load #, or vehicle..."
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: isDesktop ? SPACING.spaceLg : SPACING.spaceMd,
            },
          ]}
        >
          {/* Toast Notification */}
          {toastMessage ? (
            <View style={styles.toastBanner}>
              <MaterialIcons name="check-circle" size={16} color="#059669" />
              <Text variant="bodySm" style={styles.toastText}>
                {toastMessage}
              </Text>
            </View>
          ) : null}

          {/* Page Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text variant="headlineMd" color={COLORS.textPrimary}>
                Credit Accounts Ledger
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={{ marginTop: 2 }}
              >
                Receivables monitoring, credit risk allocation, and balance
                reconciliation
              </Text>
            </View>

            <View style={styles.topActions}>
              <Button
                label="Record Advance"
                icon="add"
                variant="outline"
                size="sm"
                onPress={() => setAdvanceDrawerVisible(true)}
              />
            </View>
          </View>

          {/* Compact Single-Row KPI Summary */}
          <CreditKPIHeader kpis={kpis} isDesktop={isDesktop} />

          {/* Filter Bar & Search */}
          <View
            style={[styles.filterBar, !isDesktop && styles.filterBarMobile]}
          >
            {isDesktop ? (
              <View style={styles.filterPills}>
                <Pressable
                  onPress={() => setActiveFilter("all")}
                  style={[
                    styles.filterPill,
                    activeFilter === "all" && styles.filterPillActive,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={
                      activeFilter === "all"
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                    style={
                      activeFilter === "all"
                        ? styles.filterPillTextActive
                        : styles.filterPillText
                    }
                  >
                    All ({creditLoads.length})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveFilter("overdue")}
                  style={[
                    styles.filterPill,
                    activeFilter === "overdue" && styles.filterPillActive,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={
                      activeFilter === "overdue"
                        ? COLORS.statusOverdueText
                        : COLORS.textSecondary
                    }
                    style={
                      activeFilter === "overdue"
                        ? styles.filterPillTextActive
                        : styles.filterPillText
                    }
                  >
                    Overdue ({overdueCount})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveFilter("partial")}
                  style={[
                    styles.filterPill,
                    activeFilter === "partial" && styles.filterPillActive,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={
                      activeFilter === "partial"
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                    style={
                      activeFilter === "partial"
                        ? styles.filterPillTextActive
                        : styles.filterPillText
                    }
                  >
                    Partial ({partialCount})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveFilter("settled")}
                  style={[
                    styles.filterPill,
                    activeFilter === "settled" && styles.filterPillActive,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={
                      activeFilter === "settled"
                        ? COLORS.statusPaidText
                        : COLORS.textSecondary
                    }
                    style={
                      activeFilter === "settled"
                        ? styles.filterPillTextActive
                        : styles.filterPillText
                    }
                  >
                    Settled ({settledCount})
                  </Text>
                </Pressable>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mobileFilterPillsScroll}
              >
                <Pressable
                  onPress={() => setActiveFilter("all")}
                  style={[
                    styles.filterPill,
                    activeFilter === "all" && styles.filterPillActive,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={
                      activeFilter === "all"
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                    style={
                      activeFilter === "all"
                        ? styles.filterPillTextActive
                        : styles.filterPillText
                    }
                  >
                    All ({creditLoads.length})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveFilter("overdue")}
                  style={[
                    styles.filterPill,
                    activeFilter === "overdue" && styles.filterPillActive,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={
                      activeFilter === "overdue"
                        ? COLORS.statusOverdueText
                        : COLORS.textSecondary
                    }
                    style={
                      activeFilter === "overdue"
                        ? styles.filterPillTextActive
                        : styles.filterPillText
                    }
                  >
                    Overdue ({overdueCount})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveFilter("partial")}
                  style={[
                    styles.filterPill,
                    activeFilter === "partial" && styles.filterPillActive,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={
                      activeFilter === "partial"
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                    style={
                      activeFilter === "partial"
                        ? styles.filterPillTextActive
                        : styles.filterPillText
                    }
                  >
                    Partial ({partialCount})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveFilter("settled")}
                  style={[
                    styles.filterPill,
                    activeFilter === "settled" && styles.filterPillActive,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={
                      activeFilter === "settled"
                        ? COLORS.statusPaidText
                        : COLORS.textSecondary
                    }
                    style={
                      activeFilter === "settled"
                        ? styles.filterPillTextActive
                        : styles.filterPillText
                    }
                  >
                    Settled ({settledCount})
                  </Text>
                </Pressable>
              </ScrollView>
            )}

            <View
              style={[styles.searchBox, !isDesktop && styles.searchBoxMobile]}
            >
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by customer, load #, or vehicle..."
                size="sm"
              />
            </View>
          </View>

          {/* Table / List View */}
          {isDesktop ? (
            /* DESKTOP COMPACT TABLE (Tablet-safe horizontal scroll container) */
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.tableScrollContainer}
            >
              <View style={styles.tableCard}>
                <View style={styles.tableHeaderRow}>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, { flex: 2.2 }]}
                  >
                    CUSTOMER & PARTICULARS
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, { flex: 1.2 }]}
                  >
                    LOAD & VEHICLE
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, styles.thRight, { flex: 1.1 }]}
                  >
                    TOTAL CREDIT
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, styles.thRight, { flex: 1.1 }]}
                  >
                    PAID
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, styles.thRight, { flex: 1.2 }]}
                  >
                    OUTSTANDING
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, { flex: 1.1 }]}
                  >
                    DUE DATE
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, styles.thCenter, { flex: 1.1 }]}
                  >
                    STATUS
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, styles.thRight, { flex: 1.2 }]}
                  >
                    ACTION
                  </Text>
                </View>

                {filteredLoads.map((load, idx) => {
                  const isOverdue = load.statusTag === "Overdue Alert";
                  const isSettled = load.statusTag === "Settled";
                  const hasAdvance =
                    (load.availableAdvance ?? 0) > 0 && load.netDue > 0;

                  return (
                    <View
                      key={load.id}
                      style={[
                        styles.tableRow,
                        idx % 2 === 1 && styles.tableRowAlt,
                        idx === filteredLoads.length - 1 && styles.tableRowLast,
                      ]}
                    >
                      {/* Customer & Particulars */}
                      <View style={[styles.tdCell, { flex: 2.2 }]}>
                        <Text
                          variant="bodyMd"
                          color={COLORS.textPrimary}
                          style={{ fontWeight: "600" }}
                        >
                          {load.customerName}
                        </Text>
                        <Text
                          variant="bodySm"
                          color={COLORS.textMuted}
                          numberOfLines={1}
                          style={{ fontSize: 11 }}
                        >
                          {load.particulars}
                        </Text>
                      </View>

                      {/* Load & Vehicle */}
                      <View style={[styles.tdCell, { flex: 1.2 }]}>
                        <Text
                          variant="tabularData"
                          color={COLORS.primary}
                          style={{ fontWeight: "600" }}
                        >
                          {load.loadNumber}
                        </Text>
                        <Text
                          variant="bodySm"
                          color={COLORS.textSecondary}
                          style={{ fontSize: 11 }}
                        >
                          {load.vehicleReg}
                        </Text>
                      </View>

                      {/* Total Credit */}
                      <View
                        style={[styles.tdCell, styles.tdRight, { flex: 1.1 }]}
                      >
                        <Text
                          variant="tabularData"
                          color={COLORS.textPrimary}
                          style={{ fontWeight: "500" }}
                        >
                          ₹{load.totalCredit.toLocaleString()}
                        </Text>
                      </View>

                      {/* Paid */}
                      <View
                        style={[styles.tdCell, styles.tdRight, { flex: 1.1 }]}
                      >
                        <Text
                          variant="tabularData"
                          color={COLORS.statusPaidText}
                          style={{ fontWeight: "500" }}
                        >
                          ₹{load.settled.toLocaleString()}
                        </Text>
                      </View>

                      {/* Outstanding */}
                      <View
                        style={[styles.tdCell, styles.tdRight, { flex: 1.2 }]}
                      >
                        <Text
                          variant="tabularData"
                          color={
                            isSettled
                              ? COLORS.textMuted
                              : isOverdue
                                ? COLORS.statusOverdueText
                                : COLORS.textPrimary
                          }
                          style={{
                            fontWeight: isSettled ? "400" : "700",
                            fontSize: 13,
                          }}
                        >
                          ₹{load.netDue.toLocaleString()}
                        </Text>
                        {hasAdvance ? (
                          <Pressable
                            onPress={() => handleOpenSettle(load, true)}
                            style={styles.advanceOffsetPill}
                          >
                            <MaterialIcons
                              name="auto-fix-high"
                              size={10}
                              color={COLORS.primary}
                            />
                            <Text
                              variant="labelSm"
                              color={COLORS.primary}
                              style={{ fontSize: 10 }}
                            >
                              Offset ₹{load.availableAdvance?.toLocaleString()}
                            </Text>
                          </Pressable>
                        ) : null}
                      </View>

                      {/* Due Date */}
                      <View style={[styles.tdCell, { flex: 1.1 }]}>
                        <Text
                          variant="bodySm"
                          color={COLORS.textSecondary}
                          style={{ fontSize: 12, fontWeight: "500" }}
                        >
                          {load.timestamp || "Net 15"}
                        </Text>
                        <Text
                          variant="bodySm"
                          color={COLORS.textMuted}
                          style={{ fontSize: 10 }}
                        >
                          {load.terms || "Standard terms"}
                        </Text>
                      </View>

                      {/* Status */}
                      <View
                        style={[styles.tdCell, styles.tdCenter, { flex: 1.1 }]}
                      >
                        <Badge
                          label={load.statusTag}
                          variant={
                            isSettled
                              ? "paid"
                              : isOverdue
                                ? "overdue"
                                : "credit"
                          }
                        />
                      </View>

                      {/* Actions */}
                      <View
                        style={[styles.tdCell, styles.tdRight, { flex: 1.2 }]}
                      >
                        {isSettled ? (
                          <View style={styles.settledCheckRow}>
                            <MaterialIcons
                              name="check"
                              size={14}
                              color={COLORS.statusPaidText}
                            />
                            <Text
                              variant="bodySm"
                              color={COLORS.statusPaidText}
                              style={{ fontWeight: "500", fontSize: 12 }}
                            >
                              Cleared
                            </Text>
                          </View>
                        ) : (
                          <Button
                            label="Settle"
                            variant="primary"
                            size="sm"
                            onPress={() => handleOpenSettle(load, false)}
                            style={styles.settleBtn}
                          />
                        )}
                      </View>
                    </View>
                  );
                })}

                {filteredLoads.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <MaterialIcons
                      name="account-balance-wallet"
                      size={32}
                      color={COLORS.border}
                    />
                    <Text
                      variant="bodyMd"
                      color={COLORS.textMuted}
                      style={{ marginTop: 8 }}
                    >
                      No credit accounts matching the filter.
                    </Text>
                  </View>
                ) : null}
              </View>
            </ScrollView>
          ) : (
            /* MOBILE COMPACT CARDS */
            <View style={styles.mobileList}>
              {filteredLoads.map((load) => {
                const isOverdue = load.statusTag === "Overdue Alert";
                const isSettled = load.statusTag === "Settled";
                const hasAdvance =
                  (load.availableAdvance ?? 0) > 0 && load.netDue > 0;

                return (
                  <View key={load.id} style={styles.mobileCard}>
                    {/* Header: Customer name & Status */}
                    <View style={styles.mobileCardHeader}>
                      <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                        <Text
                          variant="bodyMd"
                          color={COLORS.textPrimary}
                          style={{ fontWeight: "700" }}
                          numberOfLines={1}
                        >
                          {load.customerName}
                        </Text>
                        <Text
                          variant="bodySm"
                          color={COLORS.textMuted}
                          style={{ fontSize: 11, marginTop: 2 }}
                        >
                          {load.loadNumber} • {load.vehicleReg}
                        </Text>
                      </View>
                      <Badge
                        label={load.statusTag}
                        variant={
                          isSettled ? "paid" : isOverdue ? "overdue" : "credit"
                        }
                      />
                    </View>

                    {/* 3-Column Metric Strip */}
                    <View style={styles.mobileCardAmounts}>
                      <View style={styles.mobileAmountCol}>
                        <Text
                          variant="labelSm"
                          color={COLORS.textMuted}
                          style={styles.mobileAmountLabel}
                        >
                          OUTSTANDING
                        </Text>
                        <Text
                          variant="tabularData"
                          color={
                            isSettled
                              ? COLORS.statusPaidText
                              : isOverdue
                                ? COLORS.statusOverdueText
                                : COLORS.textPrimary
                          }
                          style={[
                            styles.mobileAmountValue,
                            { fontWeight: isSettled ? "500" : "700" },
                          ]}
                        >
                          ₹{load.netDue.toLocaleString()}
                        </Text>
                      </View>

                      <View style={styles.mobileAmountCol}>
                        <Text
                          variant="labelSm"
                          color={COLORS.textMuted}
                          style={styles.mobileAmountLabel}
                        >
                          TOTAL CREDIT
                        </Text>
                        <Text
                          variant="tabularData"
                          color={COLORS.textPrimary}
                          style={styles.mobileAmountValue}
                        >
                          ₹{load.totalCredit.toLocaleString()}
                        </Text>
                      </View>

                      <View style={styles.mobileAmountCol}>
                        <Text
                          variant="labelSm"
                          color={COLORS.textMuted}
                          style={styles.mobileAmountLabel}
                        >
                          DUE DATE
                        </Text>
                        <Text
                          variant="bodySm"
                          color={COLORS.textSecondary}
                          style={[
                            styles.mobileAmountValue,
                            { fontWeight: "500", fontSize: 12 },
                          ]}
                        >
                          {load.timestamp || "Net 15"}
                        </Text>
                      </View>
                    </View>

                    {/* Particulars if present */}
                    {load.particulars ? (
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        numberOfLines={1}
                        style={{ fontSize: 11 }}
                      >
                        {load.particulars}
                      </Text>
                    ) : null}

                    {/* Footer / Actions */}
                    <View style={styles.mobileCardFooter}>
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        style={{ fontSize: 11 }}
                      >
                        Paid: ₹{load.settled.toLocaleString()}
                      </Text>

                      {isSettled ? (
                        <View style={styles.settledCheckRow}>
                          <MaterialIcons
                            name="check-circle"
                            size={14}
                            color={COLORS.statusPaidText}
                          />
                          <Text
                            variant="bodySm"
                            color={COLORS.statusPaidText}
                            style={{ fontWeight: "600", fontSize: 12 }}
                          >
                            Settled
                          </Text>
                        </View>
                      ) : (
                        <View style={{ flexDirection: "row", gap: 6 }}>
                          {hasAdvance ? (
                            <Button
                              label={`Offset ₹${load.availableAdvance?.toLocaleString()}`}
                              variant="outline"
                              size="sm"
                              onPress={() => handleOpenSettle(load, true)}
                            />
                          ) : null}
                          <Button
                            label="Settle"
                            variant="primary"
                            size="sm"
                            onPress={() => handleOpenSettle(load, false)}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}

              {filteredLoads.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text variant="bodyMd" color={COLORS.textMuted}>
                    No credit accounts found.
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>

        {/* Modals & Drawers */}
        <SettleCreditModal
          visible={settleModalVisible}
          item={selectedLoad}
          initialApplyAdvance={autoApplyAdvance}
          onClose={() => setSettleModalVisible(false)}
          onConfirmClearance={handleConfirmClearance}
        />

        <RecordAdvanceDrawer
          visible={advanceDrawerVisible}
          onClose={() => setAdvanceDrawerVisible(false)}
          onSaveDeposit={(newAdv) => {
            setAdvanceDrawerVisible(false);
            showToast(
              `Recorded advance of ₹${newAdv.totalAdvance.toLocaleString()} for ${newAdv.customerName}`,
            );
          }}
        />
      </View>
    </OfficeWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.spaceBase,
    paddingBottom: SPACING.space3xl,
    maxWidth: 1200,
    width: "100%",
    marginHorizontal: "auto",
  },
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.spaceMd,
    paddingVertical: SPACING.spaceSm,
    marginBottom: SPACING.spaceMd,
  },
  toastText: {
    color: "#065F46",
    fontWeight: "500",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.spaceMd,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: SPACING.spaceSm,
    marginBottom: SPACING.spaceMd,
  },
  filterPills: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  filterPillActive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 12,
  },
  filterPillTextActive: {
    fontSize: 12,
    fontWeight: "600",
  },
  searchBox: {
    width: 280,
  },
  filterBarMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: SPACING.spaceSm,
  },
  mobileFilterPillsScroll: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 2,
  },
  searchBoxMobile: {
    width: "100%",
  },
  // Table
  tableScrollContainer: {
    minWidth: 920,
    flexGrow: 1,
  },
  tableCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: "hidden",
    width: "100%",
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.spaceMd,
    paddingVertical: SPACING.spaceSm + 2,
    backgroundColor: COLORS.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  thCell: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  thRight: {
    textAlign: "right",
  },
  thCenter: {
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.spaceMd,
    paddingVertical: SPACING.spaceSm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  tableRowAlt: {
    backgroundColor: "#FBFBFC",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tdCell: {
    gap: 2,
  },
  tdRight: {
    alignItems: "flex-end",
    textAlign: "right",
  },
  tdCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  advanceOffsetPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 2,
  },
  settledCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  settleBtn: {
    height: 30,
    minWidth: 70,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.space3xl,
  },
  // Mobile
  mobileList: {
    gap: SPACING.spaceSm,
  },
  mobileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.spaceBase,
    gap: SPACING.spaceSm,
  },
  mobileCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  mobileCardAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm,
  },
  mobileAmountCol: {
    gap: 2,
  },
  mobileAmountLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
  mobileAmountValue: {
    fontSize: 13,
  },
  mobileCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
});
