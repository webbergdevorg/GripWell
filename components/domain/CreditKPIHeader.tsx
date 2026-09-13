/**
 * Gripwellmain Component: CreditKPIHeader
 * 4 Financial Metric Cards with progress indicators and status pills.
 * Matches Stitch Screen 9: Credit & Advance Payments (edd10a6def0445efb812fd869ef0800b)
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { CreditLedgerKPISummary } from "../../types/models";
import { Text } from "../ui/Text";

export interface CreditKPIHeaderProps {
  kpis: CreditLedgerKPISummary;
  isDesktop?: boolean;
}

export const CreditKPIHeader: React.FC<CreditKPIHeaderProps> = ({
  kpis,
  isDesktop = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        isDesktop ? styles.desktopGrid : styles.mobileGrid,
      ]}
    >
      {/* Card 1: Total Credit Given */}
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text variant="labelSm" style={styles.label}>
            TOTAL CREDIT GIVEN
          </Text>
          <MaterialIcons
            name="account-balance-wallet"
            size={18}
            color={COLORS.secondary}
          />
        </View>
        <View style={styles.valueRow}>
          <Text variant="headlineXl" style={styles.value}>
            ₹{kpis.totalCreditGiven.toLocaleString()}
          </Text>
          <Text variant="labelSm" style={styles.changeBadge}>
            {kpis.totalCreditChange}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="bodySm" color={COLORS.textSecondary}>
            Active debits
          </Text>
          <Text variant="bodySm" style={styles.detailValue}>
            {kpis.activeDebitsCount} Accounts
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: "75%", backgroundColor: COLORS.secondary },
            ]}
          />
        </View>
      </View>

      {/* Card 2: Total Recovered */}
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text variant="labelSm" style={styles.label}>
            TOTAL RECOVERED
          </Text>
          <MaterialIcons name="verified" size={18} color="#059669" />
        </View>
        <View style={styles.valueRow}>
          <Text variant="headlineXl" style={styles.value}>
            ₹{kpis.totalRecovered.toLocaleString()}
          </Text>
          <Text variant="labelSm" color={COLORS.textMuted}>
            {kpis.recoveredPercentage}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="bodySm" color={COLORS.textSecondary}>
            Scheduled clearance
          </Text>
          <Text variant="bodySm" style={styles.detailValue}>
            {kpis.scheduledClearance}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: "0%", backgroundColor: "#059669" },
            ]}
          />
        </View>
      </View>

      {/* Card 3: Net Outstanding Credit */}
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text variant="labelSm" style={styles.label}>
            NET OUTSTANDING CREDIT
          </Text>
          <MaterialIcons name="warning" size={18} color="#DC2626" />
        </View>
        <View style={styles.valueRow}>
          <Text
            variant="headlineXl"
            style={[styles.value, { color: "#DC2626" }]}
          >
            ₹{kpis.netOutstandingCredit.toLocaleString()}
          </Text>
          <View style={styles.criticalBadge}>
            <Text variant="labelSm" style={styles.criticalText}>
              {kpis.criticalStatus}
            </Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text variant="bodySm" color={COLORS.textSecondary}>
            Default exposure
          </Text>
          <Text
            variant="bodySm"
            style={[styles.detailValue, { color: "#DC2626" }]}
          >
            {kpis.defaultExposure}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: "100%", backgroundColor: "#DC2626" },
            ]}
          />
        </View>
      </View>

      {/* Card 4: Total Advance Balance Held */}
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text variant="labelSm" style={styles.label}>
            TOTAL ADVANCE BALANCE HELD
          </Text>
          <MaterialIcons name="savings" size={18} color={COLORS.secondary} />
        </View>
        <View style={styles.valueRow}>
          <Text variant="headlineXl" style={styles.value}>
            ₹{kpis.totalAdvanceBalanceHeld.toLocaleString()}
          </Text>
          <View style={styles.securedBadge}>
            <Text variant="labelSm" style={styles.securedText}>
              {kpis.advanceStatus}
            </Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text variant="bodySm" color={COLORS.textSecondary}>
            Unmapped pool
          </Text>
          <Text variant="bodySm" style={styles.detailValue}>
            {kpis.unmappedPool}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: "66%", backgroundColor: COLORS.secondary },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.spaceBase,
    marginBottom: SPACING.spaceLg,
  },
  desktopGrid: {
    flexDirection: "row",
  },
  mobileGrid: {
    flexDirection: "column",
  },
  card: {
    flex: 1,
    minWidth: 200,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.spaceBase,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "space-between",
    ...Platform.select({
      web: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      },
      default: {
        elevation: 1,
      },
    }),
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.spaceSm,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: SPACING.spaceXs + 2,
    marginBottom: SPACING.spaceXs,
  },
  value: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  changeBadge: {
    color: COLORS.secondary,
    fontWeight: "600",
  },
  criticalBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  criticalText: {
    color: "#DC2626",
    fontSize: 10,
    fontWeight: "700",
  },
  securedBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  securedText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: "700",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
    marginBottom: SPACING.spaceSm,
  },
  detailValue: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  progressBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
