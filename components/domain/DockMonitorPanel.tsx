/**
 * Gripwell - Domain: DockMonitorPanel
 * Right-side dock activity monitor and dispatch actions for Desktop.
 * Stitch Reference: e9b548ccd0614c4189ec143905d33313
 */

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { TYPOGRAPHY } from "../../constants/typography";
import { Consignment } from "../../types/models";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

interface DockMonitorPanelProps {
  recentLoads: Consignment[];
  isSubmitting: boolean;
  gatePassIssued: boolean;
  onSubmitDispatch: () => void;
  onCancel: () => void;
  onViewGatePass?: () => void;
}

export const DockMonitorPanel: React.FC<DockMonitorPanelProps> = ({
  recentLoads,
  isSubmitting,
  gatePassIssued,
  onSubmitDispatch,
  onCancel,
  onViewGatePass,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. Today at Dock Metrics */}
      <View style={styles.section}>
        <Text
          variant="labelSm"
          color={COLORS.textMuted}
          style={styles.sectionTitle}
        >
          TODAY DISPATCH
        </Text>
        <View style={styles.metricsGrid}>
          {/* Dispatched */}
          <View style={styles.metricCard}>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.metricLabel}
            >
              Dispatched
            </Text>
            <Text
              variant="headlineSm"
              color={COLORS.textPrimary}
              style={styles.metricValue}
            >
              3 Loads
            </Text>
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.metricSub}
            >
              240 units
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Recent Loads */}
      <View style={styles.section}>
        <View style={styles.recentHeader}>
          <Text
            variant="labelSm"
            color={COLORS.textMuted}
            style={styles.sectionTitle}
          >
            RECENT LOADS
          </Text>
        </View>

        <View style={styles.loadsList}>
          {recentLoads.map((load, idx) => (
            <View
              key={load.id}
              style={[
                styles.loadRow,
                idx < recentLoads.length - 1 && styles.rowDivider,
              ]}
            >
              <View style={styles.loadInfo}>
                <Text
                  variant="bodyMd"
                  color={COLORS.textPrimary}
                  style={styles.loadTitle}
                >
                  Load #{idx + 1}{" "}
                  <Text
                    variant="tabularData"
                    color={COLORS.textMuted}
                    style={styles.loadPlate}
                  >
                    {load.vehicleNumber}
                  </Text>
                </Text>
                <Text variant="bodySm" color={COLORS.textSecondary}>
                  {load.customerName} •{" "}
                  {load.dispatchTime.replace("Today ", "")}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Dispatch Actions */}
      <View style={styles.actionsSection}>
        {gatePassIssued ? (
          <View style={{ gap: 8 }}>
            <Button
              title="Gate Pass Issued ✓"
              variant="primary"
              disabled
              style={styles.successButton}
            />
            {onViewGatePass && (
              <Button
                title="View Digital Gate Pass (#GP-04) →"
                variant="secondary"
                onPress={onViewGatePass}
              />
            )}
          </View>
        ) : (
          <Button
            title={isSubmitting ? "Issuing..." : "Dispatch"}
            variant="primary"
            onPress={onSubmitDispatch}
            disabled={isSubmitting}
            style={styles.actionButton}
          />
        )}

        <View style={styles.cancelWrapper}>
          <Pressable
            onPress={onCancel}
            style={({ pressed }: any) => [
              styles.cancelBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.cancelText}
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.spaceXl,
  },
  section: {
    gap: SPACING.spaceSm,
  },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: SPACING.spaceSm,
  },
  metricCard: {
    flex: 1,
    padding: SPACING.spaceSm + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    gap: 2,
  },
  metricLabel: {
    fontSize: 11,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  metricSub: {
    fontSize: 11,
    marginTop: 2,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readOnlyText: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.tabularMono.fontFamily,
  },
  loadsList: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },
  loadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceSm + 2,
    paddingVertical: SPACING.spaceSm,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  loadInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: SPACING.spaceSm,
  },
  loadTitle: {
    fontWeight: "500",
  },
  loadPlate: {
    fontSize: 11,
    marginLeft: 4,
  },
  actionsSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.spaceLg,
    gap: SPACING.spaceSm,
  },
  actionButton: {
    height: 36,
  },
  successButton: {
    height: 36,
    backgroundColor: COLORS.statusPaidText, // Emerald
  },
  cancelWrapper: {
    alignItems: "center",
    paddingTop: 4,
  },
  cancelBtn: {
    paddingVertical: 4,
    paddingHorizontal: SPACING.spaceSm,
  },
  cancelText: {
    fontSize: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
