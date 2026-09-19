/**
 * Gripwell - Office Advances Route Alias
 * Gripwell - Office Workspace: Advance Payments Tab
 * Dedicated implementation for customer advances, deposit ledger & allocation tracking.
 */

import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { RecordAdvanceDrawer } from "../../components/domain/RecordAdvanceDrawer";
import { OfficeWorkspaceShell } from "../../components/navigation/OfficeWorkspaceShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { TextInput } from "../../components/ui/TextInput";
import { COLORS } from "../../constants/colors";
import { INITIAL_ADVANCE_DEPOSITS } from "../../constants/mockCreditLedger";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import { AdvanceDepositItem } from "../../types/models";
import { formatINR } from "../../utils/currency";

export default function AdvancePaymentsScreen() {
  const { isDesktop } = useResponsive();

  const [deposits, setDeposits] = useState<AdvanceDepositItem[]>(
    INITIAL_ADVANCE_DEPOSITS,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModeFilter, setSelectedModeFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [recordDrawerVisible, setRecordDrawerVisible] = useState(false);
  const [activeDetailItem, setActiveDetailItem] =
    useState<AdvanceDepositItem | null>(null);

  // Summary Metrics calculations
  const totalPool = useMemo(
    () => deposits.reduce((sum, d) => sum + d.totalAdvance, 0),
    [deposits],
  );
  const totalAllocated = useMemo(
    () => deposits.reduce((sum, d) => sum + d.applied, 0),
    [deposits],
  );
  const totalAvailable = useMemo(
    () =>
      deposits.reduce(
        (sum, d) =>
          sum + (d.remaining ?? Math.max(0, d.totalAdvance - d.applied)),
        0,
      ),
    [deposits],
  );
  const availableCount = useMemo(
    () => deposits.filter((d) => d.applied === 0 && d.remaining > 0).length,
    [deposits],
  );
  const partialCount = useMemo(
    () => deposits.filter((d) => d.applied > 0 && d.remaining > 0).length,
    [deposits],
  );
  const usedCount = useMemo(
    () => deposits.filter((d) => d.remaining === 0).length,
    [deposits],
  );
  const usedPool = useMemo(
    () =>
      deposits
        .filter((d) => d.remaining === 0)
        .reduce((s, d) => s + d.totalAdvance, 0),
    [deposits],
  );
  const activeCount = deposits.length;

  // Filtered deposits
  const filteredDeposits = useMemo(() => {
    return deposits.filter((d) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          (d.customerName || "").toLowerCase().includes(q) ||
          (d.id || "").toLowerCase().includes(q) ||
          (d.code || "").toLowerCase().includes(q) ||
          (d.note && d.note.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // Mode filter
      if (selectedModeFilter !== "all") {
        if (!d.mode.toLowerCase().includes(selectedModeFilter.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (selectedStatusFilter !== "all") {
        if (
          selectedStatusFilter === "available" &&
          !(d.applied === 0 && d.remaining > 0)
        )
          return false;
        if (
          selectedStatusFilter === "partial" &&
          !(d.applied > 0 && d.remaining > 0)
        )
          return false;
        if (selectedStatusFilter === "used" && !(d.remaining <= 0))
          return false;
      }

      return true;
    });
  }, [deposits, searchQuery, selectedModeFilter, selectedStatusFilter]);

  const handleSaveAdvance = (newDeposit: AdvanceDepositItem) => {
    setDeposits((prev) => [newDeposit, ...prev]);
  };

  const getStatusBadge = (d: AdvanceDepositItem) => {
    if (d.remaining <= 0) {
      return <Badge label="Fully Used" variant="neutral" />;
    }
    if (d.applied > 0) {
      return <Badge label="Partially Used" variant="calibrating" />;
    }
    return <Badge label="Available" variant="paid" />;
  };

  return (
    <OfficeWorkspaceShell
      activeTab="advances"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Filter by customer, ID or note..."
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.workspaceInner,
            {
              paddingHorizontal: isDesktop ? SPACING.spaceLg : SPACING.spaceMd,
            },
          ]}
        >
          {/* Section 1: Minimal Title & Actions Bar */}
          <View style={styles.pageHeader}>
            <View>
              <Text variant="headlineSm" style={styles.pageTitle}>
                Advance Payments
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={styles.pageSubtitle}
              >
                Customer advances and allocation tracking.
              </Text>
            </View>

            <Button
              title="Record Advance"
              icon="add-circle-outline"
              variant="primary"
              size="sm"
              onPress={() => setRecordDrawerVisible(true)}
            />
          </View>

          {/* Section 2: Compact 4-Metric Summary Row */}
          <View
            style={[styles.metricsRow, !isDesktop && styles.metricsRowMobile]}
          >
            <View
              style={[styles.metricCard, !isDesktop && styles.metricCardMobile]}
            >
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={styles.metricLabel}
              >
                AVAILABLE
              </Text>
              <Text
                variant="headlineSm"
                color={COLORS.statusPaidText}
                style={styles.metricVal}
              >
                {formatINR(totalAvailable, false)}
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={{ fontSize: 10, marginTop: 2 }}
              >
                {availableCount} available
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                isDesktop ? styles.metricDivider : styles.metricCardMobile,
              ]}
            >
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={styles.metricLabel}
              >
                PARTIALLY USED
              </Text>
              <Text
                variant="headlineSm"
                color={COLORS.primary}
                style={styles.metricVal}
              >
                {formatINR(totalAllocated, false)}
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={{ fontSize: 10, marginTop: 2 }}
              >
                {partialCount} active
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                isDesktop ? styles.metricDivider : styles.metricCardMobile,
              ]}
            >
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={styles.metricLabel}
              >
                FULLY USED
              </Text>
              <Text
                variant="headlineSm"
                color={COLORS.textSecondary}
                style={styles.metricVal}
              >
                {formatINR(usedPool, false)}
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={{ fontSize: 10, marginTop: 2 }}
              >
                {usedCount} cleared
              </Text>
            </View>

            <View
              style={[
                styles.metricCard,
                isDesktop ? styles.metricDivider : styles.metricCardMobile,
              ]}
            >
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={styles.metricLabel}
              >
                TOTAL POOL
              </Text>
              <Text
                variant="headlineSm"
                color={COLORS.textPrimary}
                style={styles.metricVal}
              >
                {formatINR(totalPool, false)}
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={{ fontSize: 10, marginTop: 2 }}
              >
                {activeCount} deposits
              </Text>
            </View>
          </View>

          {/* Section 3: Filter & Search Bar */}
          <View
            style={[styles.filterStrip, !isDesktop && styles.filterStripMobile]}
          >
            {isDesktop ? (
              <>
                <View style={styles.searchBox}>
                  <MaterialIcons
                    name="search"
                    size={15}
                    color={COLORS.textMuted}
                  />
                  <TextInput
                    placeholder="Filter by customer, ID or note..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    size="sm"
                    containerStyle={styles.searchInputContainer}
                  />
                </View>

                <View style={styles.filterPillsGroup}>
                  {/* Payment Mode filters */}
                  {["all", "upi", "bank", "cash"].map((mode) => (
                    <Pressable
                      key={mode}
                      onPress={() => setSelectedModeFilter(mode)}
                      style={[
                        styles.filterPill,
                        selectedModeFilter === mode && styles.filterPillActive,
                      ]}
                    >
                      <Text
                        variant="labelSm"
                        color={
                          selectedModeFilter === mode
                            ? COLORS.textPrimary
                            : COLORS.textSecondary
                        }
                        style={{
                          fontWeight:
                            selectedModeFilter === mode ? "600" : "400",
                        }}
                      >
                        {mode === "all"
                          ? "All Modes"
                          : mode === "upi"
                            ? "UPI"
                            : mode === "bank"
                              ? "Bank Transfer"
                              : "Cash"}
                      </Text>
                    </Pressable>
                  ))}

                  <View style={styles.filterDivider} />

                  {/* Status filters */}
                  {[
                    { id: "all", label: "All Statuses" },
                    { id: "available", label: "Available" },
                    { id: "partial", label: "Partially Used" },
                    { id: "used", label: "Fully Used" },
                  ].map((st) => (
                    <Pressable
                      key={st.id}
                      onPress={() => setSelectedStatusFilter(st.id)}
                      style={[
                        styles.filterPill,
                        selectedStatusFilter === st.id &&
                          styles.filterPillActive,
                      ]}
                    >
                      <Text
                        variant="labelSm"
                        color={
                          selectedStatusFilter === st.id
                            ? COLORS.textPrimary
                            : COLORS.textSecondary
                        }
                        style={{
                          fontWeight:
                            selectedStatusFilter === st.id ? "600" : "400",
                        }}
                      >
                        {st.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            ) : (
              <>
                <View style={styles.searchBoxMobile}>
                  <MaterialIcons
                    name="search"
                    size={15}
                    color={COLORS.textMuted}
                  />
                  <TextInput
                    placeholder="Filter by customer, ID or note..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    size="sm"
                    containerStyle={styles.searchInputContainer}
                  />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.mobileFilterPillsScroll}
                >
                  {/* Payment Mode filters */}
                  {["all", "upi", "bank", "cash"].map((mode) => (
                    <Pressable
                      key={mode}
                      onPress={() => setSelectedModeFilter(mode)}
                      style={[
                        styles.filterPill,
                        selectedModeFilter === mode && styles.filterPillActive,
                      ]}
                    >
                      <Text
                        variant="labelSm"
                        color={
                          selectedModeFilter === mode
                            ? COLORS.textPrimary
                            : COLORS.textSecondary
                        }
                        style={{
                          fontWeight:
                            selectedModeFilter === mode ? "600" : "400",
                        }}
                      >
                        {mode === "all"
                          ? "All Modes"
                          : mode === "upi"
                            ? "UPI"
                            : mode === "bank"
                              ? "Bank"
                              : "Cash"}
                      </Text>
                    </Pressable>
                  ))}

                  <View style={styles.filterDivider} />

                  {/* Status filters */}
                  {[
                    { id: "all", label: "All Statuses" },
                    { id: "available", label: "Available" },
                    { id: "partial", label: "Partially Used" },
                    { id: "used", label: "Fully Used" },
                  ].map((st) => (
                    <Pressable
                      key={st.id}
                      onPress={() => setSelectedStatusFilter(st.id)}
                      style={[
                        styles.filterPill,
                        selectedStatusFilter === st.id &&
                          styles.filterPillActive,
                      ]}
                    >
                      <Text
                        variant="labelSm"
                        color={
                          selectedStatusFilter === st.id
                            ? COLORS.textPrimary
                            : COLORS.textSecondary
                        }
                        style={{
                          fontWeight:
                            selectedStatusFilter === st.id ? "600" : "400",
                        }}
                      >
                        {st.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
          </View>

          {/* Section 4: Compact Ledger (Desktop Table or Mobile Rows) */}
          {isDesktop ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.tableScrollContainer}
            >
              <View style={styles.tableContainer}>
                {/* Table Header: 7 Columns */}
                <View style={styles.tableHeadRow}>
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
                    style={[styles.thCell, styles.thRight, { flex: 1.1 }]}
                  >
                    ADVANCE AMOUNT
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, styles.thRight, { flex: 1.1 }]}
                  >
                    ALLOCATED
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, styles.thRight, { flex: 1.2 }]}
                  >
                    REMAINING
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={[styles.thCell, { flex: 1.2 }]}
                  >
                    DATE & MODE
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
                    style={[styles.thCell, styles.thRight, { flex: 1.0 }]}
                  >
                    ACTION
                  </Text>
                </View>

                {/* Table Rows */}
                {filteredDeposits.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text variant="bodySm" color={COLORS.textMuted}>
                      No advance deposits found matching the current filters.
                    </Text>
                  </View>
                ) : (
                  filteredDeposits.map((dep, idx) => (
                    <View
                      key={dep.id}
                      style={[
                        styles.tableRow,
                        idx % 2 === 1 && styles.tableRowAlt,
                        idx === filteredDeposits.length - 1 &&
                          styles.tableRowLast,
                      ]}
                    >
                      {/* Customer & Details */}
                      <View style={[styles.tdCell, { flex: 2.2 }]}>
                        <Text
                          variant="bodySm"
                          color={COLORS.textPrimary}
                          style={{ fontWeight: "600" }}
                        >
                          {dep.customerName}
                        </Text>
                        <Text
                          variant="bodySm"
                          color={COLORS.textMuted}
                          style={{ fontSize: 11 }}
                        >
                          {dep.id} • {dep.code}
                        </Text>
                        {dep.note ? (
                          <Text
                            variant="bodySm"
                            color={COLORS.textMuted}
                            style={{ fontSize: 10, marginTop: 1 }}
                            numberOfLines={1}
                          >
                            {dep.note}
                          </Text>
                        ) : null}
                      </View>

                      {/* Advance Amount */}
                      <View
                        style={[styles.tdCell, styles.tdRight, { flex: 1.1 }]}
                      >
                        <Text
                          variant="tabularData"
                          color={COLORS.textPrimary}
                          style={{ fontWeight: "500" }}
                        >
                          {formatINR(dep.totalAdvance, false)}
                        </Text>
                      </View>

                      {/* Allocated */}
                      <View
                        style={[styles.tdCell, styles.tdRight, { flex: 1.1 }]}
                      >
                        <Text
                          variant="tabularData"
                          color={COLORS.textSecondary}
                          style={{ fontWeight: "500" }}
                        >
                          {formatINR(dep.applied, false)}
                        </Text>
                      </View>

                      {/* Remaining */}
                      <View
                        style={[styles.tdCell, styles.tdRight, { flex: 1.2 }]}
                      >
                        <Text
                          variant="tabularData"
                          color={COLORS.statusPaidText}
                          style={{ fontWeight: "700" }}
                        >
                          {formatINR(dep.remaining, false)}
                        </Text>
                      </View>

                      {/* Date & Mode */}
                      <View style={[styles.tdCell, { flex: 1.2 }]}>
                        <Text
                          variant="bodySm"
                          color={COLORS.textPrimary}
                          style={{ fontSize: 12 }}
                        >
                          {dep.timestamp}
                        </Text>
                        <Text
                          variant="bodySm"
                          color={COLORS.textMuted}
                          style={{ fontSize: 10 }}
                        >
                          {dep.mode}
                        </Text>
                      </View>

                      {/* Status */}
                      <View
                        style={[styles.tdCell, styles.tdCenter, { flex: 1.1 }]}
                      >
                        {getStatusBadge(dep)}
                      </View>

                      {/* Action */}
                      <View
                        style={[styles.tdCell, styles.tdRight, { flex: 1.0 }]}
                      >
                        <Button
                          label="View"
                          variant="outline"
                          size="sm"
                          onPress={() => setActiveDetailItem(dep)}
                        />
                      </View>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          ) : (
            /* Mobile Compact Cards */
            <View style={styles.mobileList}>
              {filteredDeposits.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text variant="bodySm" color={COLORS.textMuted}>
                    No advance deposits found.
                  </Text>
                </View>
              ) : (
                filteredDeposits.map((dep) => (
                  <View key={dep.id} style={styles.mobileCard}>
                    {/* Header: Customer name & Status */}
                    <View style={styles.mobileCardHeader}>
                      <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                        <Text
                          variant="bodyMd"
                          color={COLORS.textPrimary}
                          style={{ fontWeight: "700" }}
                          numberOfLines={1}
                        >
                          {dep.customerName}
                        </Text>
                        <Text
                          variant="bodySm"
                          color={COLORS.textMuted}
                          style={{ fontSize: 11, marginTop: 2 }}
                        >
                          {dep.id} • {dep.mode} • {dep.timestamp}
                        </Text>
                      </View>
                      {getStatusBadge(dep)}
                    </View>

                    {/* 3-Column Metric Strip */}
                    <View style={styles.mobileCardAmounts}>
                      <View style={styles.mobileAmountCol}>
                        <Text
                          variant="labelSm"
                          color={COLORS.textMuted}
                          style={styles.mobileAmountLabel}
                        >
                          REMAINING
                        </Text>
                        <Text
                          variant="tabularData"
                          color={COLORS.statusPaidText}
                          style={[
                            styles.mobileAmountValue,
                            { fontWeight: "700" },
                          ]}
                        >
                          {formatINR(dep.remaining, false)}
                        </Text>
                      </View>

                      <View style={styles.mobileAmountCol}>
                        <Text
                          variant="labelSm"
                          color={COLORS.textMuted}
                          style={styles.mobileAmountLabel}
                        >
                          ALLOCATED
                        </Text>
                        <Text
                          variant="tabularData"
                          color={COLORS.textSecondary}
                          style={styles.mobileAmountValue}
                        >
                          {formatINR(dep.applied, false)}
                        </Text>
                      </View>

                      <View style={styles.mobileAmountCol}>
                        <Text
                          variant="labelSm"
                          color={COLORS.textMuted}
                          style={styles.mobileAmountLabel}
                        >
                          ADVANCE
                        </Text>
                        <Text
                          variant="tabularData"
                          color={COLORS.textPrimary}
                          style={styles.mobileAmountValue}
                        >
                          {formatINR(dep.totalAdvance, false)}
                        </Text>
                      </View>
                    </View>

                    {/* Note if present */}
                    {dep.note ? (
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        numberOfLines={1}
                        style={{ fontSize: 11 }}
                      >
                        {dep.note}
                      </Text>
                    ) : null}

                    {/* Footer / Actions */}
                    <View style={styles.mobileCardFooter}>
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        style={{ fontSize: 11 }}
                      >
                        Code: {dep.code}
                      </Text>

                      <Button
                        label="View Details"
                        variant="outline"
                        size="sm"
                        onPress={() => setActiveDetailItem(dep)}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Section 5: Advance Detail Slide-over / Modal */}
          {activeDetailItem && (
            <Modal
              visible={Boolean(activeDetailItem)}
              transparent
              animationType="fade"
              onRequestClose={() => setActiveDetailItem(null)}
            >
              <View style={styles.detailOverlay}>
                <Pressable
                  style={styles.detailBackdrop}
                  onPress={() => setActiveDetailItem(null)}
                />
                <View style={styles.detailModal}>
                  <View style={styles.detailHeader}>
                    <View>
                      <Text variant="headlineSm" style={{ fontWeight: "700" }}>
                        {activeDetailItem.customerName}
                      </Text>
                      <Text
                        variant="bodySm"
                        color={COLORS.textMuted}
                        style={{ fontSize: 11 }}
                      >
                        {activeDetailItem.id} • {activeDetailItem.code}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => setActiveDetailItem(null)}
                      style={styles.detailCloseBtn}
                    >
                      <MaterialIcons
                        name="close"
                        size={18}
                        color={COLORS.textMuted}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.detailBody}>
                    <View style={styles.detailGrid}>
                      <View style={styles.detailCol}>
                        <Text variant="labelSm" color={COLORS.textMuted}>
                          PAYMENT MODE
                        </Text>
                        <Text variant="bodySm" color={COLORS.textPrimary}>
                          {activeDetailItem.mode}
                        </Text>
                      </View>
                      <View style={styles.detailCol}>
                        <Text variant="labelSm" color={COLORS.textMuted}>
                          ORIGINAL DEPOSIT
                        </Text>
                        <Text
                          variant="tabularData"
                          color={COLORS.textPrimary}
                          style={{ fontWeight: "600" }}
                        >
                          {formatINR(activeDetailItem.totalAdvance, false)}
                        </Text>
                      </View>
                      <View style={styles.detailCol}>
                        <Text variant="labelSm" color={COLORS.textMuted}>
                          CURRENTLY ALLOCATED
                        </Text>
                        <Text
                          variant="tabularData"
                          color={COLORS.textSecondary}
                        >
                          {formatINR(activeDetailItem.applied, false)}
                        </Text>
                      </View>
                      <View style={styles.detailCol}>
                        <Text variant="labelSm" color={COLORS.textMuted}>
                          REMAINING BALANCE
                        </Text>
                        <Text
                          variant="tabularData"
                          color={COLORS.statusPaidText}
                          style={{ fontWeight: "700" }}
                        >
                          {formatINR(activeDetailItem.remaining, false)}
                        </Text>
                      </View>
                    </View>

                    {/* Note / Remarks if present */}
                    {activeDetailItem.note ? (
                      <View style={{ marginTop: 4 }}>
                        <Text variant="labelSm" color={COLORS.textMuted}>
                          NOTE / REMARKS
                        </Text>
                        <Text
                          variant="bodySm"
                          color={COLORS.textPrimary}
                          style={{ marginTop: 2 }}
                        >
                          {activeDetailItem.note}
                        </Text>
                      </View>
                    ) : null}

                    {/* Payment proof / deposit slip if present */}
                    {activeDetailItem.depositSlipFilename ? (
                      <View style={{ marginTop: 4 }}>
                        <Text variant="labelSm" color={COLORS.textMuted}>
                          PAYMENT PROOF ATTACHMENT
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 3,
                          }}
                        >
                          <MaterialIcons
                            name="attach-file"
                            size={14}
                            color={COLORS.secondary}
                          />
                          <Text
                            variant="bodySm"
                            color={COLORS.secondary}
                            style={{ fontWeight: "500" }}
                          >
                            {activeDetailItem.depositSlipFilename}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Allocation History */}
                    <View style={styles.historySection}>
                      <Text
                        variant="labelSm"
                        color={COLORS.textMuted}
                        style={styles.historyTitle}
                      >
                        ALLOCATION HISTORY
                      </Text>
                      {(activeDetailItem.appliedMapping &&
                        activeDetailItem.appliedMapping.length > 0) ||
                      (activeDetailItem.appliedMappings &&
                        activeDetailItem.appliedMappings.length > 0) ? (
                        (
                          activeDetailItem.appliedMapping ||
                          activeDetailItem.appliedMappings ||
                          []
                        ).map((map) => (
                          <View key={map.id} style={styles.historyRow}>
                            <Text variant="bodySm" color={COLORS.textPrimary}>
                              {map.title}
                            </Text>
                            <Text
                              variant="tabularData"
                              color={COLORS.textSecondary}
                              style={{ fontWeight: "600" }}
                            >
                              {formatINR(map.amount, false)}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text
                          variant="bodySm"
                          color={COLORS.textMuted}
                          style={{ fontSize: 12 }}
                        >
                          {activeDetailItem.allocation ||
                            "No shipments offset against this deposit yet."}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.detailFooter}>
                    <Button
                      title="Close"
                      variant="secondary"
                      size="sm"
                      onPress={() => setActiveDetailItem(null)}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )}

          {/* Record Advance Drawer */}
          <RecordAdvanceDrawer
            visible={recordDrawerVisible}
            onClose={() => setRecordDrawerVisible(false)}
            onSaveDeposit={handleSaveAdvance}
            isDesktop={isDesktop}
          />
        </View>
      </ScrollView>
    </OfficeWorkspaceShell>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  workspaceInner: {
    paddingTop: SPACING.spaceBase,
    gap: SPACING.spaceBase,
    maxWidth: 1200,
    marginHorizontal: "auto",
    width: "100%",
  },

  // Page Header
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: SPACING.spaceSm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pageTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  pageSubtitle: {
    marginTop: 2,
    fontSize: 12,
  },

  // 4-Metric Strip
  metricsRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metricsRowMobile: {
    flexWrap: "wrap",
    padding: SPACING.spaceSm,
  },
  metricCard: {
    flex: 1,
    paddingHorizontal: 8,
  },
  metricCardMobile: {
    minWidth: "46%",
    paddingVertical: 6,
  },
  metricDivider: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.borderSubtle,
  },
  metricLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricVal: {
    fontWeight: "700",
  },

  // Filter Strip
  filterStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  filterStripMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: SPACING.spaceSm,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 8,
    height: 32,
    width: 260,
  },
  searchBoxMobile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 8,
    height: 36,
    width: "100%",
  },
  searchInputContainer: {
    borderWidth: 0,
    height: 28,
    flex: 1,
    paddingHorizontal: 4,
  },
  filterPillsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mobileFilterPillsScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  filterPillActive: {
    backgroundColor: "#FFFFFF",
    borderColor: COLORS.primary,
  },
  filterDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },

  // Desktop Table
  tableScrollContainer: {
    minWidth: 880,
    flexGrow: 1,
  },
  tableContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    width: "100%",
  },
  tableHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  },
  tdCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  // Mobile Cards
  mobileList: {
    gap: SPACING.spaceSm,
  },
  mobileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.spaceBase,
    gap: SPACING.spaceSm,
  },
  mobileCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },

  // Detail Modal / Overlay
  detailOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.spaceMd,
  },
  detailBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  detailModal: {
    width: "90%",
    maxWidth: 480,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.spaceLg,
    gap: SPACING.spaceMd,
    zIndex: 101,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingBottom: 8,
  },
  detailCloseBtn: {
    padding: 4,
  },
  detailBody: {
    gap: 12,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailCol: {
    width: "45%",
    gap: 2,
  },
  historySection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    gap: 4,
  },
  historyTitle: {
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  detailFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 8,
  },
});
