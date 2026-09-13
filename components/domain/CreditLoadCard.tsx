/**
 * Gripwellmain Component: CreditLoadCard
 * Financial ledger card for outstanding credit loads.
 * Matches Stitch Screen 9 specifications.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { CreditLedgerItem } from "../../types/models";
import { Text } from "../ui/Text";

export interface CreditLoadCardProps {
  item: CreditLedgerItem;
  onSettle: (item: CreditLedgerItem, autoApplyAdvance?: boolean) => void;
  onGenerateMemo: (item: CreditLedgerItem) => void;
}

export const CreditLoadCard: React.FC<CreditLoadCardProps> = ({
  item,
  onSettle,
  onGenerateMemo,
}) => {
  const isOverdue = item.statusTag === "Overdue Alert";
  const isSettled = item.statusTag === "Settled";

  return (
    <View style={styles.card}>
      {/* Top Header: Load Box, Title, Badge & Timestamp */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarBox}>
            <Text variant="headlineSm" style={styles.avatarText}>
              {item.id}
            </Text>
          </View>
          <View style={styles.titleInfo}>
            <View style={styles.titleBadgeRow}>
              <Text variant="headlineSm" style={styles.loadTitle}>
                {item.loadNumber} — {item.customerName}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  isOverdue
                    ? styles.statusOverdueBadge
                    : isSettled
                      ? styles.statusSettledBadge
                      : styles.statusPartialBadge,
                ]}
              >
                <Text
                  variant="labelSm"
                  style={[
                    styles.statusBadgeText,
                    isOverdue
                      ? styles.statusOverdueText
                      : isSettled
                        ? styles.statusSettledText
                        : styles.statusPartialText,
                  ]}
                >
                  {item.statusTag.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.subtitle}
            >
              Trip ID: {item.tripId} • Route: {item.route}
            </Text>
          </View>
        </View>

        <View style={styles.timeTag}>
          <MaterialIcons name="schedule" size={14} color={COLORS.textMuted} />
          <Text
            variant="tabularData"
            color={COLORS.textSecondary}
            style={styles.timeText}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>

      {/* Driver & Vehicle Box */}
      <View style={styles.assignedGrid}>
        <View style={styles.assignedItem}>
          <MaterialIcons name="person" size={16} color={COLORS.secondary} />
          <Text variant="bodySm" color={COLORS.textMuted}>
            Assigned Driver:
          </Text>
          <Text variant="labelMd" style={styles.assignedValue}>
            {item.driverName}
          </Text>
        </View>
        <View style={styles.assignedItem}>
          <MaterialIcons
            name="local-shipping"
            size={16}
            color={COLORS.secondary}
          />
          <Text variant="bodySm" color={COLORS.textMuted}>
            Vehicle Reg:
          </Text>
          <Text variant="labelMd" style={styles.assignedValue}>
            {item.vehicleReg}
          </Text>
        </View>
      </View>

      {/* Particulars & Balance Ledger Mini-Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text variant="labelSm" style={[styles.tableCol, { flex: 2 }]}>
            PARTICULARS
          </Text>
          <Text
            variant="labelSm"
            style={[styles.tableCol, styles.tableColRight]}
          >
            TOTAL CREDIT
          </Text>
          <Text
            variant="labelSm"
            style={[styles.tableCol, styles.tableColRight]}
          >
            SETTLED
          </Text>
          <Text
            variant="labelSm"
            style={[styles.tableCol, styles.tableColRight]}
          >
            NET DUE
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text variant="bodyMd" style={[styles.particularsText, { flex: 2 }]}>
            {item.particulars}
          </Text>
          <Text
            variant="tabularData"
            style={[styles.tableValue, styles.tableColRight]}
          >
            ₹{item.totalCredit.toLocaleString()}
          </Text>
          <Text
            variant="tabularData"
            style={[styles.settledValue, styles.tableColRight]}
          >
            ₹{item.settled.toLocaleString()}
          </Text>
          <Text
            variant="tabularData"
            style={[
              styles.netDueValue,
              styles.tableColRight,
              isOverdue && { color: "#DC2626" },
              isSettled && { color: "#059669" },
            ]}
          >
            ₹{item.netDue.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Advance Match Banner (if client has advance in pool) */}
      {item.availableAdvance && !isSettled ? (
        <View style={styles.advanceBanner}>
          <View style={styles.advanceBannerLeft}>
            <MaterialIcons name="info" size={18} color={COLORS.secondary} />
            <Text variant="bodySm" color={COLORS.textPrimary}>
              <Text
                variant="bodySm"
                style={{ fontWeight: "700", color: COLORS.secondary }}
              >
                ₹{item.availableAdvance.toLocaleString()}
              </Text>{" "}
              advance available from this client in pool.
            </Text>
          </View>
          <Pressable
            onPress={() => onSettle(item, true)}
            style={({ pressed }: any) => [
              styles.autoApplyBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text variant="labelSm" style={styles.autoApplyText}>
              Auto-Apply
            </Text>
          </Pressable>
        </View>
      ) : null}

      {/* Terms Subtext if present */}
      {item.terms && !isSettled ? (
        <View style={styles.termsRow}>
          <Text variant="bodySm" color={COLORS.textMuted}>
            {item.terms}
          </Text>
        </View>
      ) : null}

      {/* Bottom Action Strip */}
      <View style={styles.actionStrip}>
        <Pressable
          onPress={() => onGenerateMemo(item)}
          style={({ pressed }: any) => [
            styles.memoBtn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
        >
          <Text variant="labelMd" style={styles.memoBtnText}>
            Generate Memo
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onSettle(item, false)}
          style={({ pressed }: any) => [
            styles.settleBtn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
        >
          <MaterialIcons name="payments" size={15} color="#FFFFFF" />
          <Text variant="labelMd" style={styles.settleBtnText}>
            {item.settled > 0
              ? "Post Next Tranche"
              : "Add Payment / Settle Credit"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.spaceBase,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.spaceBase,
    gap: SPACING.spaceSm + 2,
    ...Platform.select({
      web: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      },
      default: {
        elevation: 1,
      },
    }),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    flex: 1,
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  titleInfo: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  loadTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  statusOverdueBadge: {
    backgroundColor: "#FEE2E2",
  },
  statusOverdueText: {
    color: "#DC2626",
    fontSize: 10,
    fontWeight: "700",
  },
  statusPartialBadge: {
    backgroundColor: "#EFF6FF",
  },
  statusPartialText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: "700",
  },
  statusSettledBadge: {
    backgroundColor: "#ECFDF5",
  },
  statusSettledText: {
    color: "#059669",
    fontSize: 10,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 11,
  },
  assignedGrid: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: SPACING.spaceSm,
    borderRadius: RADIUS.sm,
    gap: SPACING.spaceBase,
  },
  assignedItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  assignedValue: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  tableContainer: {
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: SPACING.spaceSm,
    paddingVertical: 6,
  },
  tableCol: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "600",
  },
  tableColRight: {
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.spaceSm,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    alignItems: "center",
  },
  particularsText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  tableValue: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  settledValue: {
    flex: 1,
    fontSize: 12,
    color: "#059669",
    fontWeight: "500",
  },
  netDueValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  advanceBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: SPACING.spaceSm,
    borderRadius: RADIUS.sm,
  },
  advanceBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  autoApplyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  autoApplyText: {
    color: COLORS.secondary,
    fontWeight: "700",
  },
  termsRow: {
    paddingTop: 2,
  },
  actionStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceSm,
    paddingTop: 4,
  },
  memoBtn: {
    height: 34,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  memoBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  settleBtn: {
    height: 34,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  settleBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.85,
  },
});
