/**
 * Gripwell - Credit Ledger Mobile Embed
 * Embedded mobile layout of Credit Ledger & Advances for Office Admin mobile view.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import {
  INITIAL_ADVANCE_DEPOSITS,
  INITIAL_CREDIT_KPIS,
  INITIAL_CREDIT_LOADS,
} from "../../constants/mockCreditLedger";
import { RADIUS, SPACING } from "../../constants/spacing";
import {
  AdvanceDepositItem,
  CreditLedgerItem,
  CreditLedgerKPISummary,
} from "../../types/models";
import { Text } from "../ui/Text";
import { AdvanceDepositCard } from "./AdvanceDepositCard";
import { CreditKPIHeader } from "./CreditKPIHeader";
import { CreditLoadCard } from "./CreditLoadCard";
import { RecordAdvanceDrawer } from "./RecordAdvanceDrawer";
import { SettleCreditModal } from "./SettleCreditModal";

export const CreditLedgerMobileEmbed: React.FC = () => {
  const [kpis, setKpis] = useState<CreditLedgerKPISummary>(INITIAL_CREDIT_KPIS);
  const [creditLoads, setCreditLoads] =
    useState<CreditLedgerItem[]>(INITIAL_CREDIT_LOADS);
  const [advanceDeposits, setAdvanceDeposits] = useState<AdvanceDepositItem[]>(
    INITIAL_ADVANCE_DEPOSITS,
  );

  const [mobileTab, setMobileTab] = useState<"credits" | "advances">("credits");

  // Modal & Drawer State
  const [settleModalVisible, setSettleModalVisible] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<CreditLedgerItem | null>(
    null,
  );
  const [autoApplyAdvance, setAutoApplyAdvance] = useState(false);
  const [advanceDrawerVisible, setAdvanceDrawerVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

    showToast(`${item.loadNumber} settled via ${mode}.`);
  };

  const handleSaveAdvanceDeposit = (newDeposit: AdvanceDepositItem) => {
    setAdvanceDeposits((prev) => [newDeposit, ...prev]);
    setKpis((prev) => ({
      ...prev,
      totalAdvanceBalanceHeld:
        prev.totalAdvanceBalanceHeld + newDeposit.totalAdvance,
      unmappedPool: `₹${(prev.totalAdvanceBalanceHeld + newDeposit.totalAdvance).toLocaleString()} liquid`,
    }));
    showToast(
      `Advance ₹${newDeposit.totalAdvance.toLocaleString()} recorded for ${newDeposit.customerName}.`,
    );
  };

  const handleGenerateMemo = (item: CreditLedgerItem) => {
    const memoText = `DEBIT MEMO #${item.tripId}: ${item.customerName} - Due ₹${item.netDue.toLocaleString()}`;
    if (Platform.OS === "web") {
      showToast(memoText);
    } else {
      Alert.alert("Debit Memo", memoText);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
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
              Credit Accounts (
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
              Advance Deposits ({advanceDeposits.length})
            </Text>
          </Pressable>
        </View>

        {/* Action Buttons */}
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
            <MaterialIcons name="check-circle" size={15} color="#FFFFFF" />
            <Text
              variant="labelSm"
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
            <MaterialIcons name="add" size={15} color={COLORS.textPrimary} />
            <Text
              variant="labelSm"
              style={{ color: COLORS.textPrimary, fontWeight: "600" }}
            >
              New Deposit
            </Text>
          </Pressable>
        </View>

        {/* 4 Financial KPIs */}
        <CreditKPIHeader kpis={kpis} isDesktop={false} />

        {/* Selected Tab Content */}
        {mobileTab === "credits" ? (
          <View style={{ gap: SPACING.spaceSm, marginTop: SPACING.spaceBase }}>
            <View style={styles.sectionHead}>
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={styles.sectionTitle}
              >
                OUTSTANDING LOADS ({creditLoads.length})
              </Text>
            </View>

            {creditLoads.map((item) => (
              <CreditLoadCard
                key={item.id}
                item={item}
                onSettle={(load, autoOffset) =>
                  handleOpenSettle(load, autoOffset)
                }
                onGenerateMemo={handleGenerateMemo}
              />
            ))}
          </View>
        ) : (
          <View style={{ gap: SPACING.spaceSm, marginTop: SPACING.spaceBase }}>
            <View style={styles.sectionHead}>
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={styles.sectionTitle}
              >
                CUSTOMER ADVANCE BALANCES ({advanceDeposits.length})
              </Text>
            </View>

            {advanceDeposits.map((item) => (
              <AdvanceDepositCard
                key={item.id}
                deposit={item}
                onAssignToLoad={() => {}}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Settle Credit Modal */}
      <SettleCreditModal
        visible={settleModalVisible}
        onClose={() => setSettleModalVisible(false)}
        item={selectedLoad}
        initialApplyAdvance={autoApplyAdvance}
        onConfirmClearance={handleConfirmClearance}
      />

      {/* Record Advance Drawer */}
      <RecordAdvanceDrawer
        visible={advanceDrawerVisible}
        onClose={() => setAdvanceDrawerVisible(false)}
        onSaveDeposit={handleSaveAdvanceDeposit}
        isDesktop={false}
      />
    </>
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
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm,
    marginBottom: SPACING.spaceSm,
  },
  toastText: {
    color: "#065F46",
    fontSize: 12,
    fontWeight: "500",
  },
  mobileSegmentRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    padding: 2,
    marginBottom: SPACING.spaceSm,
  },
  mobileSegmentTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.xs - 1,
  },
  mobileSegmentTabActive: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mobileSegmentText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  mobileSegmentTextActive: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  mobileActionButtons: {
    flexDirection: "row",
    gap: SPACING.spaceSm,
    marginBottom: SPACING.spaceSm + 2,
  },
  mobileSettleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 36,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xs,
  },
  mobileAdvanceBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 36,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
  },
  pressed: {
    opacity: 0.8,
  },
  sectionHead: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
