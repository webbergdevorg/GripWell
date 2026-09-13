/**
 * Gripwell - Domain: OverdueAccountsCard
 * Section 1 of Owner Dashboard: Aging debt & credit risk management.
 * Stitch Reference: e4417dd385884672a2d0c906471e734c (Desktop) & e788725a610143499fffb7fc001b6ce9 (Mobile)
 */

import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { TYPOGRAPHY } from "../../constants/typography";
import { CreditAccount } from "../../types/models";
import { formatINR } from "../../utils/currency";
import { Text } from "../ui/Text";

interface OverdueAccountsCardProps {
  accounts: CreditAccount[];
  isDesktop: boolean;
  onViewLedger?: (account: CreditAccount) => void;
  onToggleFreezeCredit?: (accountId: string) => void;
}

export const OverdueAccountsCard: React.FC<OverdueAccountsCardProps> = ({
  accounts: initialAccounts,
  isDesktop,
  onViewLedger,
  onToggleFreezeCredit,
}) => {
  const [accounts, setAccounts] = useState<CreditAccount[]>(initialAccounts);

  const handleToggleFreeze = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, isFrozen: !acc.isFrozen } : acc,
      ),
    );
    onToggleFreezeCredit?.(id);
  };

  if (isDesktop) {
    return (
      <View style={styles.cardContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text
              variant="labelSm"
              color={COLORS.textPrimary}
              style={styles.headerTitle}
            >
              OVERDUE / CREDIT ACCOUNTS
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.headerSubtitle}
            >
              Customers with outstanding dues or aging terms
            </Text>
          </View>
          <Text variant="labelSm" color={COLORS.textMuted}>
            {accounts.length} Accounts Active
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeadRow}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colCustomer}
            >
              Customer
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colVehicle}
            >
              Driver / Vehicle
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colTerms}
            >
              Due Date / Terms
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colDue}
            >
              Net Due
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colAction}
            >
              Action
            </Text>
          </View>

          {/* Table Rows */}
          {accounts.map((acc, idx) => (
            <View
              key={acc.id}
              style={[
                styles.tableRow,
                idx < accounts.length - 1 && styles.rowDivider,
              ]}
            >
              {/* Customer */}
              <View style={styles.colCustomer}>
                <Text
                  variant="bodyMd"
                  color={COLORS.textPrimary}
                  style={{ fontWeight: "500" }}
                >
                  {acc.customerName}
                </Text>
                <Text
                  variant="tabularData"
                  color={COLORS.textMuted}
                  style={styles.accountNumber}
                >
                  Acc #{acc.accountNumber}
                </Text>
              </View>

              {/* Driver / Vehicle */}
              <View style={styles.colVehicle}>
                <Text variant="bodySm" color={COLORS.textSecondary}>
                  {acc.driverName} • {acc.vehicleNumber}
                </Text>
              </View>

              {/* Due Date / Terms */}
              <View style={styles.colTerms}>
                <Text
                  variant="bodySm"
                  color={
                    acc.isOverdue
                      ? COLORS.statusOverdueFill
                      : COLORS.textSecondary
                  }
                  style={acc.isOverdue ? styles.overdueText : undefined}
                >
                  {acc.dueDescription}
                </Text>
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={{ fontSize: 11 }}
                >
                  {acc.terms}
                </Text>
              </View>

              {/* Net Due */}
              <View style={styles.colDue}>
                <Text
                  variant="tabularData"
                  color={COLORS.textPrimary}
                  style={styles.netDueText}
                >
                  {formatINR(acc.netDue, false)}
                </Text>
              </View>

              {/* Action */}
              <View style={styles.colAction}>
                {acc.isOverdue ? (
                  <Pressable
                    onPress={() => handleToggleFreeze(acc.id)}
                    style={({ pressed }: any) => [
                      styles.freezeBtn,
                      acc.isFrozen && styles.frozenBtn,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      variant="labelSm"
                      color={
                        acc.isFrozen
                          ? COLORS.textMuted
                          : COLORS.statusOverdueFill
                      }
                      style={{ fontWeight: "500" }}
                    >
                      {acc.isFrozen ? "Credit Frozen" : "Freeze Credit"}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => onViewLedger?.(acc)}
                    style={({ pressed }: any) => [
                      styles.viewLedgerBtn,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      variant="labelSm"
                      color={COLORS.textPrimary}
                      style={{ fontWeight: "500" }}
                    >
                      View Ledger
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Mobile Version
  return (
    <View style={styles.mobileSection}>
      {/* Section Header */}
      <View style={styles.mobileHeader}>
        <View>
          <Text
            variant="labelSm"
            color={COLORS.textPrimary}
            style={styles.headerTitle}
          >
            OVERDUE / CREDIT ACCOUNTS
          </Text>
          <Text
            variant="bodySm"
            color={COLORS.textMuted}
            style={{ fontSize: 11 }}
          >
            Customers with outstanding dues or aging terms
          </Text>
        </View>
        <Text
          variant="labelSm"
          color={COLORS.textSecondary}
          style={{ fontSize: 11 }}
        >
          {accounts.length} Active
        </Text>
      </View>

      {/* Cards List */}
      <View style={styles.mobileCardsContainer}>
        {accounts.map((acc, idx) => (
          <View
            key={acc.id}
            style={[
              styles.mobileCard,
              idx < accounts.length - 1 && styles.rowDivider,
            ]}
          >
            {/* Top Row: Customer + Net Due */}
            <View style={styles.mobileCardTop}>
              <View
                style={{ flex: 1, minWidth: 0, paddingRight: SPACING.spaceSm }}
              >
                <View style={styles.customerNameRow}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: acc.isOverdue
                          ? COLORS.statusOverdueFill
                          : COLORS.border,
                      },
                    ]}
                  />
                  <Text
                    variant="bodyMd"
                    color={COLORS.textPrimary}
                    style={styles.mobileCustomerTitle}
                    numberOfLines={1}
                  >
                    {acc.customerName}
                  </Text>
                </View>
                <Text
                  variant="tabularData"
                  color={COLORS.textMuted}
                  style={styles.mobileAccountNo}
                >
                  Acc #{acc.accountNumber}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={styles.netDueLabel}
                >
                  NET DUE
                </Text>
                <Text
                  variant="headlineSm"
                  color={COLORS.textPrimary}
                  style={styles.mobileDueText}
                >
                  {formatINR(acc.netDue, false)}
                </Text>
              </View>
            </View>

            {/* Middle Row: Vehicle & Driver */}
            <View style={styles.mobileVehicleRow}>
              <Text variant="bodySm" color={COLORS.textMuted}>
                Vehicle:{" "}
                <Text variant="bodySm" color={COLORS.textSecondary}>
                  {acc.driverName} • {acc.vehicleNumber}
                </Text>
              </Text>
            </View>

            {/* Bottom Row: Terms + Action Button */}
            <View style={styles.mobileCardBottom}>
              <View style={styles.termsRow}>
                <Text
                  variant="bodySm"
                  color={
                    acc.isOverdue
                      ? COLORS.statusOverdueFill
                      : COLORS.textSecondary
                  }
                  style={acc.isOverdue ? styles.overdueText : undefined}
                >
                  {acc.dueDescription}
                </Text>
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={{ fontSize: 11, marginLeft: 4 }}
                >
                  ({acc.terms})
                </Text>
              </View>

              {acc.isOverdue ? (
                <Pressable
                  onPress={() => handleToggleFreeze(acc.id)}
                  style={({ pressed }: any) => [
                    styles.mobileActionBtn,
                    styles.mobileFreezeBorder,
                    acc.isFrozen && styles.frozenBorder,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={
                      acc.isFrozen ? COLORS.textMuted : COLORS.statusOverdueFill
                    }
                    style={{ fontWeight: "600" }}
                  >
                    {acc.isFrozen ? "Credit Frozen" : "Freeze Credit"}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => onViewLedger?.(acc)}
                  style={({ pressed }: any) => [
                    styles.mobileActionBtn,
                    styles.mobileLedgerBorder,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    color={COLORS.textSecondary}
                    style={{ fontWeight: "600" }}
                  >
                    View Ledger
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: SPACING.spaceLg,
    paddingVertical: SPACING.spaceBase,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  table: {
    width: "100%",
  },
  tableHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingVertical: SPACING.spaceSm + 2,
    paddingHorizontal: SPACING.spaceLg,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.spaceBase,
    paddingHorizontal: SPACING.spaceLg,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  colCustomer: {
    flex: 3,
  },
  accountNumber: {
    fontSize: 11,
    marginTop: 2,
  },
  colVehicle: {
    flex: 3,
  },
  colTerms: {
    flex: 2,
  },
  overdueText: {
    fontWeight: "600",
  },
  colDue: {
    flex: 2,
    alignItems: "flex-end",
    paddingRight: SPACING.spaceBase,
  },
  netDueText: {
    fontWeight: "600",
    fontSize: 14,
  },
  colAction: {
    flex: 2,
    alignItems: "flex-end",
  },
  freezeBtn: {
    paddingVertical: 4,
    paddingHorizontal: SPACING.spaceSm,
  },
  frozenBtn: {
    opacity: 0.6,
  },
  viewLedgerBtn: {
    paddingVertical: 4,
    paddingHorizontal: SPACING.spaceSm,
  },
  pressed: {
    opacity: 0.7,
  },

  // Mobile
  mobileSection: {
    gap: SPACING.spaceSm,
  },
  mobileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  mobileCardsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: "hidden",
  },
  mobileCard: {
    padding: SPACING.spaceBase,
    gap: SPACING.spaceSm,
  },
  mobileCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  customerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  mobileCustomerTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
  mobileAccountNo: {
    fontSize: 11,
    marginTop: 2,
    paddingLeft: 12,
  },
  netDueLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
  mobileDueText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: TYPOGRAPHY.tabularMono.fontFamily,
    marginTop: 1,
  },
  mobileVehicleRow: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  mobileCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 2,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mobileActionBtn: {
    paddingVertical: 3,
    paddingHorizontal: SPACING.spaceSm + 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
  },
  mobileFreezeBorder: {
    borderColor: "#FECDD3",
    backgroundColor: "#FFF1F2",
  },
  frozenBorder: {
    borderColor: COLORS.borderSubtle,
    backgroundColor: COLORS.surfaceSecondary,
  },
  mobileLedgerBorder: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
});
