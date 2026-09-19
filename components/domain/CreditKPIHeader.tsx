/**
 * Gripwell - Domain Component: CreditKPIHeader
 * Compact financial metric summary strip.
 * Information-dense single row (desktop) and compact 2x2 grid (mobile).
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
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
        isDesktop ? styles.desktopStrip : styles.mobileGrid,
      ]}
    >
      {/* Metric 1: Outstanding Credit */}
      <View style={[styles.item, isDesktop && styles.desktopItemBorder]}>
        <View style={styles.labelRow}>
          <MaterialIcons
            name="warning"
            size={13}
            color={COLORS.statusOverdueText}
          />
          <Text variant="labelSm" color={COLORS.textMuted} style={styles.label}>
            OUTSTANDING
          </Text>
        </View>
        <View style={styles.valueRow}>
          <Text
            variant="headlineSm"
            color={COLORS.statusOverdueText}
            style={styles.metricValue}
          >
            ₹{kpis.netOutstandingCredit.toLocaleString()}
          </Text>
          <Text
            variant="labelSm"
            color={COLORS.statusOverdueText}
            style={styles.subBadge}
          >
            {kpis.criticalStatus || "High Risk"}
          </Text>
        </View>
      </View>

      {/* Metric 2: Total Recovered */}
      <View style={[styles.item, isDesktop && styles.desktopItemBorder]}>
        <View style={styles.labelRow}>
          <MaterialIcons
            name="verified"
            size={13}
            color={COLORS.statusPaidText}
          />
          <Text variant="labelSm" color={COLORS.textMuted} style={styles.label}>
            RECOVERED
          </Text>
        </View>
        <View style={styles.valueRow}>
          <Text
            variant="headlineSm"
            color={COLORS.statusPaidText}
            style={styles.metricValue}
          >
            ₹{kpis.totalRecovered.toLocaleString()}
          </Text>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.subText}
          >
            {kpis.recoveredPercentage || "0%"}
          </Text>
        </View>
      </View>

      {/* Metric 3: Total Credit Given */}
      <View style={[styles.item, isDesktop && styles.desktopItemBorder]}>
        <View style={styles.labelRow}>
          <MaterialIcons
            name="account-balance-wallet"
            size={13}
            color={COLORS.secondary}
          />
          <Text variant="labelSm" color={COLORS.textMuted} style={styles.label}>
            TOTAL CREDIT GIVEN
          </Text>
        </View>
        <View style={styles.valueRow}>
          <Text
            variant="headlineSm"
            color={COLORS.textPrimary}
            style={styles.metricValue}
          >
            ₹{kpis.totalCreditGiven.toLocaleString()}
          </Text>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.subText}
          >
            {kpis.totalCreditChange || "+0%"}
          </Text>
        </View>
      </View>

      {/* Metric 4: Active Accounts */}
      <View style={styles.item}>
        <View style={styles.labelRow}>
          <MaterialIcons
            name="people-alt"
            size={13}
            color={COLORS.textSecondary}
          />
          <Text variant="labelSm" color={COLORS.textMuted} style={styles.label}>
            ACCOUNTS
          </Text>
        </View>
        <View style={styles.valueRow}>
          <Text
            variant="headlineSm"
            color={COLORS.textPrimary}
            style={styles.metricValue}
          >
            {kpis.activeDebitsCount}
          </Text>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.subText}
          >
            active debits
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: SPACING.spaceLg,
  },
  desktopStrip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.spaceSm + 2,
    paddingHorizontal: SPACING.spaceMd,
  },
  mobileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: SPACING.spaceSm,
  },
  item: {
    flex: 1,
    minWidth: "46%",
    paddingHorizontal: SPACING.spaceSm + 2,
    paddingVertical: 4,
    gap: 2,
  },
  desktopItemBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.borderSubtle,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  subBadge: {
    fontSize: 10,
    fontWeight: "600",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    backgroundColor: "#FEF2F2",
  },
  subText: {
    fontSize: 11,
  },
});
