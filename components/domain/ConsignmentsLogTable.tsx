/**
 * Gripwell - Domain: ConsignmentsLogTable
 * Section 2 of Owner Dashboard: Master dispatch reconciliation records stream.
 * Stitch Reference: e4417dd385884672a2d0c906471e734c (Desktop) & e788725a610143499fffb7fc001b6ce9 (Mobile)
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { TYPOGRAPHY } from "../../constants/typography";
import { ReconciliationRecord } from "../../types/models";
import { formatINR } from "../../utils/currency";
import { Badge } from "../ui/Badge";
import { Text } from "../ui/Text";
import { TextInput } from "../ui/TextInput";

interface ConsignmentsLogTableProps {
  records: ReconciliationRecord[];
  isDesktop: boolean;
}

export const ConsignmentsLogTable: React.FC<ConsignmentsLogTableProps> = ({
  records: initialRecords,
  isDesktop,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = initialRecords.filter(
    (rec) =>
      rec.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.manifestSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.paymentMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.loadSequence.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalValue = filteredRecords.reduce((sum, r) => sum + r.value, 0);

  if (isDesktop) {
    return (
      <View style={styles.cardContainer}>
        {/* Header & Filter */}
        <View style={styles.header}>
          <View>
            <Text
              variant="labelSm"
              color={COLORS.textPrimary}
              style={styles.headerTitle}
            >
              TODAY'S CONSIGNMENTS LOG
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.headerSubtitle}
            >
              Master dispatch reconciliation records for Oct 24
            </Text>
          </View>

          {/* Search Filter Box */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={15} color={COLORS.textMuted} />
            <TextInput
              placeholder="Filter load or customer..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              size="sm"
              containerStyle={styles.searchInput}
            />
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Head */}
          <View style={styles.tableHeadRow}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colLoadId}
            >
              Load ID
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colTime}
            >
              Dispatch Time
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colCust}
            >
              Customer
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colManifest}
            >
              Manifest
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colValue}
            >
              Value
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colMode}
            >
              Mode
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.colStatus}
            >
              Status
            </Text>
          </View>

          {/* Rows */}
          {filteredRecords.map((r, idx) => (
            <View
              key={r.id}
              style={[
                styles.tableRow,
                idx < filteredRecords.length - 1 && styles.rowDivider,
              ]}
            >
              <Text
                variant="tabularData"
                color={COLORS.textPrimary}
                style={styles.colLoadId}
              >
                {r.loadSequence}
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={styles.colTime}
              >
                {r.dispatchTime}
              </Text>
              <Text
                variant="bodyMd"
                color={COLORS.textPrimary}
                style={styles.colCustText}
              >
                {r.customerName}
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={styles.colManifest}
                numberOfLines={1}
              >
                {r.manifestSummary}
              </Text>
              <Text
                variant="tabularData"
                color={COLORS.textPrimary}
                style={styles.colValueText}
              >
                {formatINR(r.value, false)}
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={styles.colMode}
              >
                {r.paymentMode}
              </Text>
              <View style={styles.colStatus}>
                <Badge
                  label={r.status}
                  variant={r.status === "Paid" ? "paid" : "pending"}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="bodySm" color={COLORS.textMuted}>
            {filteredRecords.length} customers recorded
          </Text>
          <Text
            variant="bodySm"
            color={COLORS.textPrimary}
            style={{ fontWeight: "600" }}
          >
            Total Value:{" "}
            <Text variant="tabularData" style={{ fontWeight: "600" }}>
              {formatINR(totalValue, false)}
            </Text>
          </Text>
        </View>
      </View>
    );
  }

  // Mobile Version
  return (
    <View style={styles.mobileSection}>
      {/* Header */}
      <View style={styles.mobileHeader}>
        <View style={{ flex: 1 }}>
          <Text
            variant="labelSm"
            color={COLORS.textPrimary}
            style={styles.headerTitle}
          >
            TODAY'S CUSTOMERS LOG
          </Text>
          <Text
            variant="bodySm"
            color={COLORS.textMuted}
            style={{ fontSize: 11 }}
          >
            Master dispatch reconciliation records for Oct 24
          </Text>
        </View>
        <Text
          variant="labelSm"
          color={COLORS.textMuted}
          style={{ fontSize: 11 }}
        >
          {filteredRecords.length} Records
        </Text>
      </View>

      {/* Mobile Search Bar */}
      <View style={styles.mobileSearchBox}>
        <MaterialIcons name="search" size={16} color={COLORS.textMuted} />
        <TextInput
          placeholder="Filter load or customer..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          size="sm"
          containerStyle={styles.mobileSearchInput}
        />
      </View>

      {/* Mobile Card List */}
      <View style={styles.mobileCardsContainer}>
        {filteredRecords.map((r, idx) => (
          <View
            key={r.id}
            style={[
              styles.mobileCard,
              idx < filteredRecords.length - 1 && styles.rowDivider,
            ]}
          >
            {/* Top: Time + Sequence + Status */}
            <View style={styles.mobileCardHeader}>
              <View style={styles.mobileMetaRow}>
                <Text
                  variant="tabularData"
                  color={COLORS.textSecondary}
                  style={{ fontSize: 11 }}
                >
                  {r.dispatchTime}
                </Text>
                <Text variant="bodySm" color={COLORS.border}>
                  •
                </Text>
                <Text
                  variant="tabularData"
                  color={COLORS.textMuted}
                  style={{ fontSize: 11 }}
                >
                  #{r.loadSequence}
                </Text>
              </View>

              <Badge
                label={r.status}
                variant={r.status === "Paid" ? "paid" : "pending"}
              />
            </View>

            {/* Title & Items */}
            <View style={styles.mobileCustomerInfo}>
              <Text
                variant="bodyMd"
                color={COLORS.textPrimary}
                style={styles.mobileCustomerName}
              >
                {r.customerName}
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                numberOfLines={1}
              >
                {r.manifestSummary}
              </Text>
            </View>

            {/* Bottom: Payment Mode + Value */}
            <View style={styles.mobileCardBottom}>
              <View>
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={{ fontSize: 10 }}
                >
                  Payment Mode
                </Text>
                <Text
                  variant="bodySm"
                  color={COLORS.textPrimary}
                  style={{ fontWeight: "500", marginTop: 1 }}
                >
                  {r.paymentMode}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={{ fontSize: 10 }}
                >
                  Value
                </Text>
                <Text
                  variant="headlineSm"
                  color={COLORS.textPrimary}
                  style={styles.mobileValueText}
                >
                  {formatINR(r.value, false)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Mobile Footer */}
      <View style={styles.mobileFooterBanner}>
        <Text
          variant="bodySm"
          color={COLORS.textSecondary}
          style={{ fontSize: 11 }}
        >
          {filteredRecords.length} customers recorded
        </Text>
        <Text
          variant="bodySm"
          color={COLORS.textMuted}
          style={{ fontSize: 11 }}
        >
          Total Dispatched:{" "}
          <Text
            variant="tabularData"
            color={COLORS.textPrimary}
            style={{ fontWeight: "700" }}
          >
            {formatINR(totalValue, false)}
          </Text>
        </Text>
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
    gap: SPACING.spaceBase,
  },
  headerTitle: {
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 230,
  },
  searchInput: {
    flex: 1,
    height: 30,
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
  colLoadId: {
    width: 140,
    fontFamily: TYPOGRAPHY.tabularMono.fontFamily,
    fontSize: 12,
  },
  colTime: {
    width: 90,
    fontSize: 11,
  },
  colCust: {
    flex: 2,
  },
  colCustText: {
    flex: 2,
    fontWeight: "500",
  },
  colManifest: {
    flex: 3,
    paddingRight: SPACING.spaceSm,
  },
  colValue: {
    width: 90,
    textAlign: "right",
  },
  colValueText: {
    width: 90,
    textAlign: "right",
    fontWeight: "600",
    fontSize: 13,
  },
  colMode: {
    width: 120,
    paddingLeft: SPACING.spaceSm,
    fontSize: 11,
  },
  colStatus: {
    width: 80,
    alignItems: "flex-end",
  },
  footer: {
    paddingHorizontal: SPACING.spaceLg,
    paddingVertical: SPACING.spaceSm + 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Mobile
  mobileSection: {
    gap: SPACING.spaceSm + 2,
  },
  mobileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  mobileSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mobileSearchInput: {
    flex: 1,
    height: 32,
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
  mobileCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mobileMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mobileCustomerInfo: {
    gap: 2,
  },
  mobileCustomerName: {
    fontWeight: "600",
    fontSize: 14,
  },
  mobileCardBottom: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mobileValueText: {
    fontWeight: "700",
    fontFamily: TYPOGRAPHY.tabularMono.fontFamily,
    fontSize: 15,
  },
  mobileFooterBanner: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: SPACING.spaceSm + 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
