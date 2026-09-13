/**
 * Gripwell - Domain Component: AdvanceDepositCard
 * Renders individual customer advance deposit pool card.
 * Matches Stitch Screen 9 specifications.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { AdvanceDepositItem } from "../../types/models";
import { Text } from "../ui/Text";

export interface AdvanceDepositCardProps {
  deposit: AdvanceDepositItem;
  onAssignToLoad: (deposit: AdvanceDepositItem) => void;
}

export const AdvanceDepositCard: React.FC<AdvanceDepositCardProps> = ({
  deposit,
  onAssignToLoad,
}) => {
  const isPending = deposit.status === "Pending Load";

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.avatarBox,
              isPending ? styles.avatarPending : styles.avatarAllocated,
            ]}
          >
            <Text
              variant="labelSm"
              style={[
                styles.avatarText,
                isPending
                  ? styles.avatarPendingText
                  : styles.avatarAllocatedText,
              ]}
            >
              {deposit.code}
            </Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text variant="headlineSm" style={styles.customerName}>
                {deposit.customerName}
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.textMuted}
                style={styles.codeText}
              >
                {deposit.id}
              </Text>
            </View>
            <View style={styles.modeRow}>
              <MaterialIcons
                name={
                  deposit.mode.includes("UPI")
                    ? "smartphone"
                    : "account-balance"
                }
                size={13}
                color={COLORS.textSecondary}
              />
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={styles.modeText}
              >
                Mode: {deposit.mode}
              </Text>
              <Text variant="bodySm" color={COLORS.textMuted}>
                • {deposit.timestamp}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Chip */}
        <View
          style={[
            styles.statusPill,
            isPending ? styles.statusPillAmber : styles.statusPillBlue,
          ]}
        >
          <Text
            variant="labelSm"
            style={[
              styles.statusText,
              isPending ? styles.statusTextAmber : styles.statusTextBlue,
            ]}
          >
            {deposit.status}
          </Text>
        </View>
      </View>

      {/* Note Quote if present */}
      {deposit.note && (
        <View style={styles.noteBox}>
          <MaterialIcons name="comment" size={13} color={COLORS.textMuted} />
          <Text
            variant="bodySm"
            color={COLORS.textSecondary}
            style={styles.noteText}
          >
            {deposit.note}
          </Text>
        </View>
      )}

      {/* 3-Column Balance Grid */}
      <View style={styles.balanceGrid}>
        <View style={styles.balanceCol}>
          <Text variant="bodySm" color={COLORS.textMuted}>
            Total Advance
          </Text>
          <Text variant="headlineSm" style={styles.balanceValue}>
            ₹{deposit.totalAdvance.toLocaleString()}
          </Text>
        </View>
        <View style={styles.balanceCol}>
          <Text variant="bodySm" color={COLORS.textMuted}>
            Applied
          </Text>
          <Text
            variant="headlineSm"
            style={[
              styles.balanceValue,
              deposit.applied > 0
                ? { color: "#059669" }
                : { color: COLORS.textMuted },
            ]}
          >
            ₹{deposit.applied.toLocaleString()}
          </Text>
        </View>
        <View style={styles.balanceCol}>
          <Text variant="bodySm" color={COLORS.textMuted}>
            Remaining
          </Text>
          <Text
            variant="headlineSm"
            style={[styles.balanceValue, { color: COLORS.secondary }]}
          >
            ₹{deposit.remaining.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Applied Mapping Trail if present */}
      {deposit.appliedMapping && deposit.appliedMapping.length > 0 && (
        <View style={styles.mappingSection}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.mappingTitle}
          >
            APPLIED MAPPING TRAIL
          </Text>
          <View style={styles.mappingList}>
            {deposit.appliedMapping.map((map) => (
              <View key={map.id} style={styles.mappingItem}>
                <View style={styles.mappingItemLeft}>
                  <MaterialIcons name="link" size={14} color="#059669" />
                  <Text variant="bodySm" color={COLORS.textPrimary}>
                    {map.title}
                  </Text>
                </View>
                <Text variant="tabularData" style={styles.mappingAmount}>
                  ₹{map.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Allocation Footer */}
      <View style={styles.footerRow}>
        <Text variant="labelSm" color={COLORS.textMuted}>
          Allocation: {deposit.allocation}
        </Text>
        <Pressable
          onPress={() => onAssignToLoad(deposit)}
          style={({ pressed }: any) => [
            styles.assignBtn,
            pressed && styles.pressed,
          ]}
        >
          <Text variant="labelSm" style={styles.assignBtnText}>
            Assign to Load
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={13}
            color={COLORS.secondary}
          />
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
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPending: {
    backgroundColor: "#DBEAFE",
  },
  avatarAllocated: {
    backgroundColor: "#F1F5F9",
  },
  avatarText: {
    fontWeight: "700",
    fontSize: 12,
  },
  avatarPendingText: {
    color: "#1E40AF",
  },
  avatarAllocatedText: {
    color: COLORS.textPrimary,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  codeText: {
    letterSpacing: 0.5,
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  modeText: {
    fontSize: 11,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  statusPillAmber: {
    backgroundColor: "#FFFBEB",
  },
  statusPillBlue: {
    backgroundColor: "#EFF6FF",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextAmber: {
    color: "#B45309",
  },
  statusTextBlue: {
    color: "#1D4ED8",
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: SPACING.spaceSm,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
  },
  noteText: {
    fontSize: 11,
    fontStyle: "italic",
  },
  balanceGrid: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: SPACING.spaceSm,
    borderRadius: RADIUS.sm,
    textAlign: "center",
  },
  balanceCol: {
    flex: 1,
    alignItems: "center",
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
    color: COLORS.textPrimary,
  },
  mappingSection: {
    gap: 4,
  },
  mappingTitle: {
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  mappingList: {
    gap: 4,
  },
  mappingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: SPACING.spaceSm,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
  },
  mappingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mappingAmount: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  assignBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  assignBtnText: {
    color: COLORS.secondary,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.8,
  },
});
