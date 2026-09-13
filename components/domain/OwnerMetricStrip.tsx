/**
 * Gripwell - Domain: OwnerMetricStrip
 * 4-Pillar Executive Fiscal KPI Grid
 * Stitch Reference: e4417dd385884672a2d0c906471e734c (Desktop) & e788725a610143499fffb7fc001b6ce9 (Mobile)
 */

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { TYPOGRAPHY } from "../../constants/typography";
import { OwnerFiscalKPI } from "../../types/models";
import { formatINR } from "../../utils/currency";
import { Text } from "../ui/Text";

interface OwnerMetricStripProps {
  metrics: OwnerFiscalKPI;
  isDesktop: boolean;
}

export const OwnerMetricStrip: React.FC<OwnerMetricStripProps> = ({
  metrics,
  isDesktop,
}) => {
  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Metric 1: Valid Loads Today */}
        <View style={styles.desktopCard}>
          <View style={styles.cardHeader}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.metricLabel}
            >
              Valid Loads Today
            </Text>
            <MaterialIcons name="inventory-2" size={16} color={COLORS.border} />
          </View>
          <View style={styles.cardBottom}>
            <Text
              variant="headlineLg"
              color={COLORS.textPrimary}
              style={styles.desktopValue}
            >
              {metrics.validLoadsToday}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.subtext}
            >
              {metrics.validLoadsDescription}
            </Text>
          </View>
        </View>

        {/* Metric 2: Collected Revenue */}
        <View style={[styles.desktopCard, styles.desktopDividerLeft]}>
          <View style={styles.cardHeader}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.metricLabel}
            >
              Collected Revenue
            </Text>
            <MaterialIcons name="payments" size={16} color={COLORS.border} />
          </View>
          <View style={styles.cardBottom}>
            <Text
              variant="headlineLg"
              color={COLORS.textPrimary}
              style={styles.desktopValue}
            >
              {formatINR(metrics.collectedRevenue, false)}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.subtext}
            >
              {metrics.collectedDescription}
            </Text>
          </View>
        </View>

        {/* Metric 3: Payment Pending */}
        <View style={[styles.desktopCard, styles.desktopDividerLeft]}>
          <View style={styles.cardHeader}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.metricLabel}
            >
              Payment Pending
            </Text>
            <MaterialIcons name="schedule" size={16} color={COLORS.border} />
          </View>
          <View style={styles.cardBottom}>
            <Text
              variant="headlineLg"
              color={COLORS.textPrimary}
              style={styles.desktopValue}
            >
              {formatINR(metrics.paymentPending, false)}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.statusPendingFill}
              style={styles.subtext}
            >
              {metrics.paymentPendingDescription}
            </Text>
          </View>
        </View>

        {/* Metric 4: Credit Outstanding */}
        <View style={[styles.desktopCard, styles.desktopDividerLeft]}>
          <View style={styles.cardHeader}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.metricLabel}
            >
              Credit Outstanding
            </Text>
            <MaterialIcons
              name="priority-high"
              size={16}
              color={COLORS.border}
            />
          </View>
          <View style={styles.cardBottom}>
            <Text
              variant="headlineLg"
              color={COLORS.textPrimary}
              style={styles.desktopValue}
            >
              {formatINR(metrics.creditOutstanding, false)}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.statusOverdueFill}
              style={styles.subtext}
            >
              {metrics.creditOutstandingDescription}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Mobile 2x2 Grid View
  return (
    <View style={styles.mobileGrid}>
      {/* Row 1 */}
      <View style={styles.mobileRow}>
        {/* Valid Loads */}
        <View style={styles.mobileCard}>
          <View style={styles.mobileCardHeader}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.mobileLabel}
            >
              VALID LOADS
            </Text>
            <MaterialIcons name="inventory-2" size={14} color={COLORS.border} />
          </View>
          <View>
            <Text
              variant="headlineMd"
              color={COLORS.textPrimary}
              style={styles.mobileValue}
            >
              {metrics.validLoadsToday}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.mobileSub}
            >
              {metrics.validLoadsDescription}
            </Text>
          </View>
        </View>

        {/* Collected Revenue */}
        <View style={styles.mobileCard}>
          <View style={styles.mobileCardHeader}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.mobileLabel}
            >
              REVENUE
            </Text>
            <MaterialIcons name="payments" size={14} color={COLORS.border} />
          </View>
          <View>
            <Text
              variant="headlineMd"
              color={COLORS.textPrimary}
              style={styles.mobileValue}
            >
              {formatINR(metrics.collectedRevenue, false)}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.mobileSub}
              numberOfLines={1}
            >
              {metrics.collectedDescription}
            </Text>
          </View>
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.mobileRow}>
        {/* Payment Pending */}
        <View style={styles.mobileCard}>
          <View style={styles.mobileCardHeader}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.mobileLabel}
            >
              PENDING
            </Text>
            <View style={styles.amberDot} />
          </View>
          <View>
            <Text
              variant="headlineMd"
              color={COLORS.textPrimary}
              style={styles.mobileValue}
            >
              {formatINR(metrics.paymentPending, false)}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.statusPendingFill}
              style={styles.mobileSub}
              numberOfLines={1}
            >
              {metrics.paymentPendingDescription}
            </Text>
          </View>
        </View>

        {/* Credit Outstanding */}
        <View style={styles.mobileCard}>
          <View style={styles.mobileCardHeader}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.mobileLabel}
            >
              CREDIT OUT
            </Text>
            <View style={styles.roseDot} />
          </View>
          <View>
            <Text
              variant="headlineMd"
              color={COLORS.textPrimary}
              style={styles.mobileValue}
            >
              {formatINR(metrics.creditOutstanding, false)}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.statusOverdueFill}
              style={styles.mobileSub}
              numberOfLines={1}
            >
              {metrics.creditOutstandingDescription}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Desktop 1x4
  desktopContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
  },
  desktopCard: {
    flex: 1,
    padding: SPACING.spaceLg,
    justifyContent: "space-between",
    minHeight: 110,
  },
  desktopDividerLeft: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.borderSubtle,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricLabel: {
    fontWeight: "500",
  },
  cardBottom: {
    marginTop: SPACING.spaceBase,
  },
  desktopValue: {
    fontFamily: TYPOGRAPHY.tabularMono.fontFamily,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 11,
    marginTop: 3,
  },

  // Mobile 2x2 Grid
  mobileGrid: {
    gap: SPACING.spaceSm + 2,
  },
  mobileRow: {
    flexDirection: "row",
    gap: SPACING.spaceSm + 2,
  },
  mobileCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.spaceSm + 4,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    justifyContent: "space-between",
    minHeight: 96,
  },
  mobileCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  mobileLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  mobileValue: {
    fontFamily: TYPOGRAPHY.tabularMono.fontFamily,
    fontSize: 18,
    fontWeight: "700",
  },
  mobileSub: {
    fontSize: 11,
    marginTop: 3,
  },
  amberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.statusPendingFill,
  },
  roseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.statusOverdueFill,
  },
});
