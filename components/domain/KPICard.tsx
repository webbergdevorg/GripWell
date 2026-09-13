/**
 * Gripwell - Domain Component: KPICard & KPIStrip
 * Flat, unboxed metric row from Stitch.
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { SPACING } from "../../constants/spacing";
import { KPISummary } from "../../types/models";
import { formatINR } from "../../utils/currency";
import { Text } from "../ui/Text";

export interface KPIStripProps {
  summary: KPISummary;
  isMobile?: boolean;
}

export const KPIStrip: React.FC<KPIStripProps> = ({
  summary,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <View style={styles.mobileContainer}>
        <View style={styles.mobileMetricItem}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.mobileLabel}
          >
            INVOICED
          </Text>
          <Text variant="headlineSm" style={styles.mobileValue}>
            {formatINR(summary.invoicedCargo, false)}
          </Text>
          <Text
            variant="bodySm"
            color={COLORS.textMuted}
            style={styles.mobileSub}
          >
            {summary.invoicedCount} loads
          </Text>
        </View>

        <View style={styles.mobileMetricItem}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.mobileLabel}
          >
            COLLECTED
          </Text>
          <Text
            variant="headlineSm"
            color={COLORS.statusPaidFill}
            style={styles.mobileValue}
          >
            {formatINR(summary.collectedAmount, false)}
          </Text>
          <Text
            variant="bodySm"
            color={COLORS.textMuted}
            style={styles.mobileSub}
          >
            Cash/UPI
          </Text>
        </View>

        <View style={styles.mobileMetricItem}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.mobileLabel}
          >
            CREDIT O/S
          </Text>
          <Text variant="headlineSm" style={styles.mobileValue}>
            {formatINR(summary.outstandingCredit, false)}
          </Text>
          <Text
            variant="bodySm"
            color={COLORS.textMuted}
            style={styles.mobileSub}
          >
            1 pending
          </Text>
        </View>

        <View style={styles.mobileMetricItem}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.mobileLabel}
          >
            ADVANCES
          </Text>
          <Text
            variant="headlineSm"
            color={COLORS.secondary}
            style={styles.mobileValue}
          >
            {formatINR(summary.advancePoolAmount, false)}
          </Text>
          <Text
            variant="bodySm"
            color={COLORS.textMuted}
            style={styles.mobileSub}
          >
            KK Stores
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.desktopContainer}>
      <View style={styles.desktopMetricItem}>
        <Text
          variant="labelSm"
          color={COLORS.textMuted}
          style={styles.desktopLabel}
        >
          TODAY'S INVOICED CARGO
        </Text>
        <Text variant="headlineLg" style={styles.desktopValue}>
          {formatINR(summary.invoicedCargo)}
        </Text>
        <Text
          variant="bodySm"
          color={COLORS.textMuted}
          style={styles.desktopSub}
        >
          {summary.invoicedCount} consignments total
        </Text>
      </View>

      <View style={styles.desktopMetricItem}>
        <Text
          variant="labelSm"
          color={COLORS.textMuted}
          style={styles.desktopLabel}
        >
          COLLECTED / SETTLED
        </Text>
        <Text variant="headlineLg" style={styles.desktopValue}>
          {formatINR(summary.collectedAmount)}
        </Text>
        <Text
          variant="bodySm"
          color={COLORS.textMuted}
          style={styles.desktopSub}
        >
          {summary.collectedDescription}
        </Text>
      </View>

      <View style={styles.desktopMetricItem}>
        <Text
          variant="labelSm"
          color={COLORS.textMuted}
          style={styles.desktopLabel}
        >
          OUTSTANDING CREDIT
        </Text>
        <Text variant="headlineLg" style={styles.desktopValue}>
          {formatINR(summary.outstandingCredit)}
        </Text>
        <Text
          variant="bodySm"
          color={COLORS.textMuted}
          style={styles.desktopSub}
        >
          {summary.outstandingDescription}
        </Text>
      </View>

      <View style={styles.desktopMetricItem}>
        <Text
          variant="labelSm"
          color={COLORS.textMuted}
          style={styles.desktopLabel}
        >
          CUSTOMER ADVANCE POOL
        </Text>
        <Text variant="headlineLg" style={styles.desktopValue}>
          {formatINR(summary.advancePoolAmount)}
        </Text>
        <Text
          variant="bodySm"
          color={COLORS.textMuted}
          style={styles.desktopSub}
        >
          {summary.advancePoolSource}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: SPACING.spaceLg,
  },
  desktopMetricItem: {
    flex: 1,
  },
  desktopLabel: {
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  desktopValue: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  desktopSub: {
    marginTop: 2,
  },
  mobileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.spaceSm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  mobileMetricItem: {
    flex: 1,
  },
  mobileLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  mobileValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    marginTop: 2,
  },
  mobileSub: {
    fontSize: 11,
    marginTop: 1,
  },
});
