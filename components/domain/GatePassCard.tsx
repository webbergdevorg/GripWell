/**
 * GripWell Pro - Domain: GatePassCard
 * Digital Gate Pass (#GP-04) Document & Verification Card.
 * Complies with Stitch design tokens, 1px borders, and security rate masking.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { GatePass } from "../../types/models";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { CargoPhotoCard } from "./CargoPhotoCard";

interface GatePassCardProps {
  pass: GatePass;
  isDesktop?: boolean;
  onStatusChange?: (newStatus: "authorized" | "exited" | "held") => void;
}

export const GatePassCard: React.FC<GatePassCardProps> = ({
  pass,
  isDesktop = false,
  onStatusChange,
}) => {
  const [gateStatus, setGateStatus] = useState<
    "authorized" | "exited" | "held"
  >(pass.gateStatus);
  const [smsSent, setSmsSent] = useState(pass.smsNotificationSent);
  const [isClearing, setIsClearing] = useState(false);

  const handlePrint = () => {
    const msg = `Printing Gate Pass #${pass.id} for Vehicle ${pass.vehicleNumber}... Sent to Yard Thermal Printer #03.`;
    if (Platform.OS === "web") {
      window.alert?.(msg);
    } else {
      Alert.alert("Print Gate Pass", msg);
    }
  };

  const handleSendSMS = () => {
    setSmsSent(true);
    const msg = `SMS with digital gate link (https://gripwell.io/gp/${pass.id.toLowerCase()}) dispatched to driver at ${pass.driverPhone}.`;
    if (Platform.OS === "web") {
      window.alert?.(msg);
    } else {
      Alert.alert("SMS Link Dispatched", msg);
    }
  };

  const handleToggleExit = () => {
    setIsClearing(true);
    setTimeout(() => {
      setIsClearing(false);
      const nextStatus = gateStatus === "authorized" ? "exited" : "authorized";
      setGateStatus(nextStatus);
      onStatusChange?.(nextStatus);
    }, 600);
  };

  const isExited = gateStatus === "exited";

  return (
    <View style={[styles.cardContainer, isDesktop && styles.desktopCard]}>
      {/* Top Security Status Bar */}
      <View
        style={[
          styles.statusBar,
          isExited ? styles.statusBarExited : styles.statusBarAuthorized,
        ]}
      >
        <View style={styles.statusLeft}>
          <MaterialIcons
            name={isExited ? "check-circle" : "verified-user"}
            size={18}
            color={isExited ? "#0369A1" : "#065F46"}
          />
          <Text
            variant="labelSm"
            style={[
              styles.statusTitle,
              { color: isExited ? "#0369A1" : "#065F46" },
            ]}
          >
            {isExited
              ? "EXIT RECORDED • GATE CLEARED"
              : "TERMINAL GATE PASS • AUTHORIZED FOR EXIT"}
          </Text>
        </View>

        <View style={styles.statusRight}>
          <Text
            variant="bodySm"
            color={isExited ? "#0369A1" : "#065F46"}
            style={{ fontWeight: "600", fontSize: 11 }}
          >
            {pass.issueDate} •{" "}
            {isExited ? pass.exitTimestamp || "02:52 PM" : pass.issueTime}
          </Text>
        </View>
      </View>

      {/* Main Gate Pass Document Body */}
      <View style={styles.docBody}>
        {/* Pass Header Row */}
        <View style={styles.docHeaderRow}>
          <View>
            <View style={styles.brandSubtitleRow}>
              <MaterialIcons
                name="local-shipping"
                size={14}
                color={COLORS.secondary}
              />
              <Text
                variant="labelSm"
                color={COLORS.secondary}
                style={styles.brandSubtitle}
              >
                GRIPWELL ROAD FREIGHT • DOCK SECURITY
              </Text>
            </View>
            <Text
              variant="headlineLg"
              color={COLORS.textPrimary}
              style={styles.passIdText}
            >
              Gate Pass #{pass.id}
            </Text>
            <Text variant="bodySm" color={COLORS.textSecondary}>
              Trip Sequence:{" "}
              <Text variant="tabularData" style={{ fontWeight: "600" }}>
                {pass.loadSequence}
              </Text>
            </Text>
          </View>

          {/* Barcode & Security Stamp Graphic */}
          <View style={styles.barcodeBox}>
            <View style={styles.barcodeLines}>
              {[
                4, 2, 6, 1, 3, 5, 2, 7, 2, 4, 1, 6, 3, 2, 5, 4, 2, 3, 5, 1, 4,
              ].map((w, i) => (
                <View
                  key={i}
                  style={{
                    width: w,
                    height: 28,
                    backgroundColor: "#0F172A",
                    marginRight: 2,
                  }}
                />
              ))}
            </View>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.barcodeText}
            >
              *{pass.id}-{pass.loadSequence.slice(-4)}*
            </Text>
          </View>
        </View>

        <View style={styles.hairline} />

        {/* 2x2 Transport Details Grid */}
        <View style={styles.detailsGrid}>
          {/* Box 1: Vehicle Plate */}
          <View style={styles.detailBox}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.detailLabel}
            >
              VEHICLE REGISTRATION
            </Text>
            <View style={styles.plateRow}>
              <View style={styles.indBadge}>
                <Text style={styles.indText}>IND</Text>
              </View>
              <Text
                variant="headlineSm"
                color={COLORS.textPrimary}
                style={styles.plateNumber}
              >
                {pass.vehicleNumber}
              </Text>
            </View>
            <Text
              variant="bodySm"
              color={COLORS.statusPaidText}
              style={{ fontSize: 11, fontWeight: "500" }}
            >
              VAHAN verified ✓
            </Text>
          </View>

          {/* Box 2: Driver Info */}
          <View style={styles.detailBox}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.detailLabel}
            >
              DRIVER ASSIGNED
            </Text>
            <Text
              variant="bodyMd"
              color={COLORS.textPrimary}
              style={{ fontWeight: "700" }}
            >
              {pass.driverName}
            </Text>
            <Text
              variant="tabularData"
              color={COLORS.textSecondary}
              style={{ fontSize: 11 }}
            >
              DL: {pass.driverDl}
            </Text>
            <Text
              variant="tabularData"
              color={COLORS.secondary}
              style={{ fontSize: 11, fontWeight: "500" }}
            >
              {pass.driverPhone} {smsSent ? "• SMS Sent ✓" : ""}
            </Text>
          </View>

          {/* Box 3: Consignee & Destination */}
          <View style={styles.detailBox}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.detailLabel}
            >
              CONSIGNEE & DESTINATION
            </Text>
            <Text
              variant="bodyMd"
              color={COLORS.textPrimary}
              style={{ fontWeight: "600" }}
              numberOfLines={1}
            >
              {pass.customerName}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textSecondary}
              style={{ fontSize: 11 }}
            >
              {pass.destinationHub}
            </Text>
          </View>

          {/* Box 4: Dock Bay & Supervisor */}
          <View style={styles.detailBox}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.detailLabel}
            >
              DISPATCH DOCK BAY
            </Text>
            <View style={styles.bayBadgeRow}>
              <View style={styles.bayDot} />
              <Text
                variant="bodyMd"
                color={COLORS.textPrimary}
                style={{ fontWeight: "600" }}
              >
                {pass.dockBay}
              </Text>
            </View>
            <Text
              variant="bodySm"
              color={COLORS.textSecondary}
              style={{ fontSize: 11 }}
            >
              Inspected by: {pass.supervisorName} (Supervisor)
            </Text>
          </View>
        </View>

        <View style={styles.hairline} />

        {/* Merchandise Manifest Summary (Rates Masked) */}
        <View style={styles.manifestSection}>
          <View style={styles.manifestHeader}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.sectionHeaderLabel}
            >
              VERIFIED MERCHANDISE MANIFEST
            </Text>
            <Badge
              label={`${pass.totalPieceCount} Total Pieces`}
              variant="settled"
            />
          </View>

          {/* Line items mini-table */}
          <View style={styles.tableWrapper}>
            <View style={styles.tableHeaderRow}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={[styles.colDesc, styles.tableHeaderCell]}
              >
                Item Description
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={[styles.colQty, styles.tableHeaderCell]}
              >
                Qty
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={[styles.colPkg, styles.tableHeaderCell]}
              >
                Packaging
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={[styles.colBay, styles.tableHeaderCell]}
              >
                Bay
              </Text>
            </View>

            {pass.items.map((item, idx) => (
              <View
                key={item.id || idx}
                style={[
                  styles.tableDataRow,
                  idx === pass.items.length - 1 && styles.tableLastRow,
                ]}
              >
                <Text
                  variant="bodySm"
                  color={COLORS.textPrimary}
                  style={[styles.colDesc, { fontWeight: "500" }]}
                >
                  {item.description}
                </Text>
                <Text
                  variant="tabularData"
                  color={COLORS.textPrimary}
                  style={[styles.colQty, { fontWeight: "600" }]}
                >
                  {item.quantity} {item.unit}
                </Text>
                <Text
                  variant="bodySm"
                  color={COLORS.textSecondary}
                  style={styles.colPkg}
                >
                  {item.packaging}
                </Text>
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={styles.colBay}
                >
                  {item.bayId || "Bay-3"}
                </Text>
              </View>
            ))}
          </View>

          {/* Rates Masked Security Banner */}
          <View style={styles.rateMaskBanner}>
            <MaterialIcons name="visibility-off" size={14} color="#64748B" />
            <Text variant="bodySm" color="#475569" style={styles.rateMaskText}>
              Commercial pricing and freight freight billing are masked per yard
              gate security protocol.
            </Text>
          </View>
        </View>

        <View style={styles.hairline} />

        {/* Rear Cargo & Security Seal Verification */}
        <View style={styles.sealSection}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.sectionHeaderLabel}
          >
            CARGO REAR SEAL VERIFICATION
          </Text>

          <View style={[styles.sealBox, isDesktop && styles.sealBoxDesktop]}>
            {/* Cargo Rear Photo Component */}
            <View style={{ flex: isDesktop ? 0.5 : 1 }}>
              <CargoPhotoCard
                filename={`${pass.vehicleNumber.replace(/\s+/g, "")}_sealed.jpg`}
                size="2.1 MB"
                isDesktop={isDesktop}
              />
            </View>

            {/* Seal Certificate Specs */}
            <View
              style={[
                styles.sealDetails,
                isDesktop && styles.sealDetailsDesktop,
              ]}
            >
              <View style={styles.sealBadgeRow}>
                <MaterialIcons
                  name="lock"
                  size={16}
                  color={COLORS.statusPaidText}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.statusPaidText}
                  style={{ fontWeight: "700" }}
                >
                  TAMPER-EVIDENT GATE SEAL
                </Text>
              </View>

              <View style={styles.sealNumberBox}>
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={{ fontSize: 10 }}
                >
                  SERIAL NUMBER
                </Text>
                <Text
                  variant="tabularData"
                  color={COLORS.textPrimary}
                  style={styles.sealNumberText}
                >
                  {pass.securitySealNumber}
                </Text>
              </View>

              <View style={styles.sealMetaRow}>
                <Text
                  variant="bodySm"
                  color={COLORS.textSecondary}
                  style={{ fontSize: 11 }}
                >
                  Physical Seal Affixed:{" "}
                  <Text style={{ fontWeight: "600" }}>Yes ✓</Text>
                </Text>
                <Text
                  variant="bodySm"
                  color={COLORS.textSecondary}
                  style={{ fontSize: 11 }}
                >
                  Bay Check: <Text style={{ fontWeight: "600" }}>Passed ✓</Text>
                </Text>
              </View>

              <View style={styles.hashBox}>
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={{ fontSize: 10 }}
                >
                  SECURITY CRYPTO HASH
                </Text>
                <Text
                  variant="tabularData"
                  color={COLORS.textMuted}
                  style={{ fontSize: 10 }}
                >
                  SHA256: 4f8b91...c3820a (Valid)
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.hairline} />

        {/* Action Controls */}
        <View style={styles.actionsRow}>
          <Button
            title="Print Gate Pass"
            icon="print"
            variant="outline"
            size="md"
            onPress={handlePrint}
            style={styles.actionBtn}
          />

          <Button
            title={smsSent ? "SMS Sent ✓" : "Send SMS to Driver"}
            icon="sms"
            variant="secondary"
            size="md"
            onPress={handleSendSMS}
            style={styles.actionBtn}
          />

          <Button
            title={
              isClearing
                ? "Recording..."
                : isExited
                  ? "Re-Authorize Entry"
                  : "Verify & Clear Gate Exit"
            }
            icon={isExited ? "undo" : "check-circle"}
            variant={isExited ? "outline" : "primary"}
            size="md"
            onPress={handleToggleExit}
            style={styles.actionBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  desktopCard: {
    maxWidth: 960,
    width: "100%",
    marginHorizontal: "auto",
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceBase,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  statusBarAuthorized: {
    backgroundColor: "#ECFDF5",
    borderBottomColor: "#A7F3D0",
  },
  statusBarExited: {
    backgroundColor: "#F0F9FF",
    borderBottomColor: "#BAE6FD",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusRight: {},
  statusTitle: {
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  docBody: {
    padding: SPACING.spaceBase,
    gap: SPACING.spaceBase,
  },
  docHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },
  brandSubtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  },
  brandSubtitle: {
    fontWeight: "600",
    fontSize: 10,
    letterSpacing: 0.8,
  },
  passIdText: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  barcodeBox: {
    alignItems: "center",
    padding: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  barcodeLines: {
    flexDirection: "row",
    alignItems: "center",
  },
  barcodeText: {
    fontSize: 9,
    marginTop: 3,
    letterSpacing: 2,
  },
  hairline: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.spaceMd,
  },
  detailBox: {
    flex: 1,
    minWidth: 180,
    backgroundColor: "#F8FAFC",
    padding: SPACING.spaceSm + 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  plateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  indBadge: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  indText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "700",
  },
  plateNumber: {
    fontWeight: "700",
    fontSize: 15,
  },
  bayBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  bayDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.statusPaidText,
  },
  manifestSection: {
    gap: 8,
  },
  manifestHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    fontWeight: "600",
    fontSize: 11,
  },
  tableDataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    backgroundColor: COLORS.surface,
  },
  tableLastRow: {
    borderBottomWidth: 0,
  },
  colDesc: {
    flex: 3,
  },
  colQty: {
    flex: 1.5,
  },
  colPkg: {
    flex: 2,
  },
  colBay: {
    flex: 1,
    textAlign: "right",
  },
  rateMaskBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rateMaskText: {
    fontSize: 11,
    flex: 1,
  },
  sealSection: {
    gap: 8,
  },
  sealBox: {
    gap: 12,
  },
  sealBoxDesktop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  sealDetails: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceSm + 2,
    gap: 8,
  },
  sealDetailsDesktop: {
    flex: 0.5,
  },
  sealBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sealNumberBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    padding: 6,
  },
  sealNumberText: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  sealMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hashBox: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 6,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.spaceSm,
    marginTop: 6,
  },
  actionBtn: {
    flex: 1,
    minWidth: 150,
  },
});
