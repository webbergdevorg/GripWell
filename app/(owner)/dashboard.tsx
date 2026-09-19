/**
 * Gripwell - Owner Executive Fiscal Dashboard
 * Stitch References:
 * - Desktop: e4417dd385884672a2d0c906471e734c
 * - Mobile: e788725a610143499fffb7fc001b6ce9
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ConsignmentsLogTable } from "../../components/domain/ConsignmentsLogTable";
import { OverdueAccountsCard } from "../../components/domain/OverdueAccountsCard";
import { OwnerMetricStrip } from "../../components/domain/OwnerMetricStrip";
import { OwnerProductsMobileEmbed } from "../../components/domain/OwnerProductsMobileEmbed";
import { UserManagementEmbed } from "../../components/domain/UserManagementEmbed";
import {
  OwnerMobileBottomNav,
  OwnerTab,
} from "../../components/navigation/OwnerMobileBottomNav";
import { RoleSwitcherPills } from "../../components/navigation/RoleSwitcherPills";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import { useRoleContext } from "../../hooks/useRoleContext";
import {
  INITIAL_CREDIT_ACCOUNTS,
  INITIAL_OWNER_KPIS,
  INITIAL_RECONCILIATION_RECORDS,
} from "../../services/api/mockData";
import {
  CreditAccount,
  OwnerFiscalKPI,
  ReconciliationRecord,
} from "../../types/models";

export default function OwnerFiscalDashboard() {
  const { isDesktop, isMobile } = useResponsive();
  const insets = useSafeAreaInsets();
  const { logout, isAdmin } = useRoleContext();

  // State
  const [metrics, setMetrics] = useState<OwnerFiscalKPI>(INITIAL_OWNER_KPIS);
  const [accounts, setAccounts] = useState<CreditAccount[]>(
    INITIAL_CREDIT_ACCOUNTS,
  );
  const [records, setRecords] = useState<ReconciliationRecord[]>(
    INITIAL_RECONCILIATION_RECORDS,
  );
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciledToast, setReconciledToast] = useState(false);
  const [topSearch, setTopSearch] = useState("");
  // Mobile tab state — controls which tab's content is shown inline
  const [activeOwnerTab, setActiveOwnerTab] = useState<OwnerTab>("dashboard");

  const filteredRecords = useMemo(() => {
    if (!topSearch.trim()) return records;
    const q = topSearch.toLowerCase().trim();
    return records.filter(
      (rec) =>
        rec.customerName.toLowerCase().includes(q) ||
        rec.manifestSummary.toLowerCase().includes(q) ||
        rec.paymentMode.toLowerCase().includes(q) ||
        rec.loadSequence.toLowerCase().includes(q) ||
        rec.id.toLowerCase().includes(q),
    );
  }, [records, topSearch]);

  const handleReconcile = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      setReconciledToast(true);
      setTimeout(() => setReconciledToast(false), 3000);
    }, 700);
  };

  const handleExport = () => {
    const msg = "Fiscal Report Export (CSV/PDF) generated successfully.";
    if (Platform.OS === "web") {
      window.alert?.(msg);
    } else {
      Alert.alert("Report Exported", msg);
    }
  };

  const handleViewLedger = (acc: CreditAccount) => {
    const msg = `Granular Ledger for ${acc.customerName} (${acc.accountNumber}):\nNet Due: ₹${acc.netDue.toLocaleString("en-IN")}\nTerms: ${acc.terms} • Status: ${acc.dueDescription}`;
    if (Platform.OS === "web") {
      window.alert?.(msg);
    } else {
      Alert.alert("Account Ledger", msg);
    }
  };

  // -------------------------------------------------------------
  // DESKTOP VIEW (e4417dd385884672a2d0c906471e734c)
  // -------------------------------------------------------------
  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Top Action Header */}
        <View style={styles.desktopTopHeader}>
          {/* Left: Brand & Owner Navigation */}
          <View style={styles.desktopHeaderLeft}>
            <View style={styles.brand}>
              <View style={styles.logoIcon}>
                <MaterialIcons
                  name="local-shipping"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
              <Text variant="labelMd" style={styles.brandTitle}>
                Gripwell
              </Text>
            </View>

            <View style={styles.vDivider} />

            {/* Owner Navigation: Dashboard | Product Catalog | Users */}
            <View style={styles.ownerNavLinks}>
              <Pressable
                onPress={() => setActiveOwnerTab("dashboard")}
                style={[
                  styles.navLinkItem,
                  activeOwnerTab === "dashboard" && styles.activeNavLinkItem,
                ]}
                accessibilityRole="tab"
                accessibilityState={{
                  selected: activeOwnerTab === "dashboard",
                }}
              >
                <MaterialIcons
                  name="dashboard"
                  size={15}
                  color={
                    activeOwnerTab === "dashboard"
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                  style={{ marginRight: 5 }}
                />
                <Text
                  variant="labelSm"
                  color={
                    activeOwnerTab === "dashboard"
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                  style={
                    activeOwnerTab === "dashboard"
                      ? styles.activeNavText
                      : styles.navText
                  }
                >
                  Dashboard
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.replace("/(owner)/products" as any)}
                style={styles.navLinkItem}
                accessibilityRole="tab"
                accessibilityState={{ selected: false }}
              >
                <MaterialIcons
                  name="inventory-2"
                  size={15}
                  color={COLORS.textSecondary}
                  style={{ marginRight: 5 }}
                />
                <Text
                  variant="labelSm"
                  color={COLORS.textSecondary}
                  style={styles.navText}
                >
                  Product Catalog
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveOwnerTab("users")}
                style={[
                  styles.navLinkItem,
                  activeOwnerTab === "users" && styles.activeNavLinkItem,
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeOwnerTab === "users" }}
              >
                <MaterialIcons
                  name="group"
                  size={15}
                  color={
                    activeOwnerTab === "users"
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                  style={{ marginRight: 5 }}
                />
                <Text
                  variant="labelSm"
                  color={
                    activeOwnerTab === "users"
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                  style={
                    activeOwnerTab === "users"
                      ? styles.activeNavText
                      : styles.navText
                  }
                >
                  Users
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Center: Admin Workspace Switcher (Admin-Only) */}
          {isAdmin && (
            <View style={styles.desktopRoleCenter}>
              <RoleSwitcherPills compact />
            </View>
          )}

          {/* Right: Search Box & Action Buttons */}
          <View style={styles.desktopHeaderRight}>
            <View style={styles.desktopSearchBox}>
              <MaterialIcons
                name="search"
                size={16}
                color={COLORS.textMuted}
                style={styles.searchIcon}
              />
              <RNTextInput
                placeholder="Search records, VINs..."
                placeholderTextColor={COLORS.textMuted}
                value={topSearch}
                onChangeText={setTopSearch}
                style={styles.desktopSearchInput}
              />
            </View>

            <Button
              title={isReconciling ? "Syncing..." : ""}
              icon="sync"
              variant="outline"
              size="sm"
              onPress={handleReconcile}
              disabled={isReconciling}
            />
            <Button
              title="Export Report"
              icon="download"
              variant="primary"
              size="sm"
              onPress={handleExport}
            />
            <Button
              title="Sign Out"
              icon="logout"
              variant="secondary"
              size="sm"
              onPress={() => {
                logout();
                router.replace("/login" as any);
              }}
            />
          </View>
        </View>

        {/* Desktop Main Content */}
        <ScrollView
          style={styles.desktopScroll}
          contentContainerStyle={styles.desktopScrollContent}
        >
          <View style={styles.desktopMaxContainer}>
            {activeOwnerTab === "dashboard" && (
              <>
                {/* Reconciled Toast */}
                {reconciledToast && (
                  <View style={styles.toastBanner}>
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color={COLORS.statusPaidText}
                    />
                    <Text
                      variant="bodySm"
                      color={COLORS.textPrimary}
                      style={{ fontWeight: "500" }}
                    >
                      All terminal ledgers reconciled with VAHAN gate records
                      and UPI bank feeds.
                    </Text>
                  </View>
                )}

                {/* 4 Minimal Key Metrics */}
                <OwnerMetricStrip metrics={metrics} isDesktop={true} />

                {/* Section 1: Overdue / Credit Accounts */}
                <OverdueAccountsCard
                  accounts={accounts}
                  isDesktop={true}
                  onViewLedger={handleViewLedger}
                />

                {/* Section 2: Today's Consignments Log */}
                <ConsignmentsLogTable
                  records={filteredRecords}
                  isDesktop={true}
                />
              </>
            )}

            {activeOwnerTab === "users" && (
              <UserManagementEmbed isDesktop={true} />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // MOBILE VIEW (e788725a610143499fffb7fc001b6ce9)
  // -------------------------------------------------------------
  return (
    <View style={styles.mobileContainer}>
      {/* Sticky Mobile Header */}
      <View
        style={[styles.mobileHeader, { paddingTop: Math.max(insets.top, 12) }]}
      >
        {/* Role Switcher Nav - Admin Only */}
        {isAdmin && (
          <View style={styles.mobileRoleNav}>
            <RoleSwitcherPills compact />
          </View>
        )}

        {/* Title Bar & Quick Actions */}
        <View style={styles.mobileTitleBar}>
          <View style={{ flex: 1 }}>
            <Text
              variant="headlineSm"
              color={COLORS.textPrimary}
              style={styles.mobileMainTitle}
            >
              Executive Fiscal Dashboard
            </Text>
            <View style={styles.mobileDateRow}>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={{ fontWeight: "500", fontSize: 11 }}
              >
                Oct 24, Today
              </Text>
              <Text variant="bodySm" color={COLORS.border}>
                •
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={{ fontSize: 11 }}
              >
                FY24-Q3
              </Text>
            </View>
          </View>

          {/* Quick Header Actions */}
          <View style={styles.mobileHeaderButtons}>
            <Pressable
              onPress={handleReconcile}
              style={({ pressed }: any) => [
                styles.mobileIconBtn,
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Reconcile data"
            >
              <MaterialIcons
                name="sync"
                size={16}
                color={COLORS.textSecondary}
              />
            </Pressable>

            <Pressable
              onPress={handleExport}
              style={({ pressed }: any) => [
                styles.mobileExportBtn,
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Export report"
            >
              <MaterialIcons
                name="download"
                size={14}
                color={COLORS.textSecondary}
              />
              <Text
                variant="labelSm"
                color={COLORS.textPrimary}
                style={{ fontWeight: "600" }}
              >
                Export
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                logout();
                router.replace("/login" as any);
              }}
              style={({ pressed }: any) => [
                styles.mobileIconBtn,
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Sign out of terminal"
            >
              <MaterialIcons
                name="logout"
                size={16}
                color={COLORS.textSecondary}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Main Scroll Content — driven by activeOwnerTab */}
      <ScrollView
        key={activeOwnerTab}
        style={styles.mobileScroll}
        contentContainerStyle={[
          styles.mobileScrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 72 },
        ]}
      >
        {activeOwnerTab === "dashboard" && (
          <>
            {/* Reconciled Toast */}
            {reconciledToast && (
              <View style={styles.mobileToast}>
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={COLORS.statusPaidText}
                />
                <Text
                  variant="bodySm"
                  color={COLORS.textPrimary}
                  style={{ flex: 1, fontSize: 11 }}
                >
                  Terminal records reconciled with bank feeds.
                </Text>
              </View>
            )}

            {/* 2x2 Metric Summary Grid */}
            <OwnerMetricStrip metrics={metrics} isDesktop={false} />

            {/* Section 1: Overdue / Credit Accounts */}
            <OverdueAccountsCard
              accounts={accounts}
              isDesktop={false}
              onViewLedger={handleViewLedger}
            />

            {/* Section 2: Today's Consignments Log */}
            <ConsignmentsLogTable records={records} isDesktop={false} />
          </>
        )}

        {activeOwnerTab === "products" && <OwnerProductsMobileEmbed />}

        {activeOwnerTab === "users" && <UserManagementEmbed />}
      </ScrollView>

      {/* Sticky Bottom Navigation Bar */}
      <OwnerMobileBottomNav
        activeTab={activeOwnerTab}
        onTabChange={setActiveOwnerTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Desktop
  desktopContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  desktopTopHeader: {
    height: SPACING.headerHeight,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.spaceXl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    ...Platform.select({
      web: {
        position: "sticky" as any,
        top: 0,
        zIndex: 30,
      },
    }),
  },
  desktopHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceBase,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm + 2,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontWeight: "600",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  vDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
  },
  ownerNavLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.xs,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  activeNavLinkItem: {
    backgroundColor: "rgba(32, 138, 239, 0.08)",
  },
  navText: {
    fontWeight: "500",
    fontSize: 12,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  activeNavText: {
    fontWeight: "700",
    fontSize: 12,
    color: COLORS.primary,
  },
  desktopRoleCenter: {
    width: 340,
    marginHorizontal: SPACING.spaceBase,
    alignItems: "center",
    justifyContent: "center",
  },
  desktopHeaderRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceSm,
  },
  desktopSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    width: 200,
    height: 32,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceSm,
  },
  searchIcon: {
    marginRight: 6,
  },
  desktopSearchInput: {
    flex: 1,
    height: "100%",
    fontSize: 12,
    color: COLORS.textPrimary,
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
      },
    }),
  },
  desktopScroll: {
    flex: 1,
  },
  desktopScrollContent: {
    paddingBottom: SPACING.space3xl,
  },
  desktopMaxContainer: {
    maxWidth: 1280,
    width: "100%",
    marginHorizontal: "auto",
    padding: SPACING.spaceXl,
    gap: SPACING.spaceXl,
  },
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm + 2,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceMd,
  },
  pressed: {
    opacity: 0.7,
  },

  // Mobile
  mobileContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mobileHeader: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.spaceBase,
    paddingBottom: SPACING.spaceSm + 2,
  },
  mobileRoleNav: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.spaceSm,
  },
  mobileTitleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.spaceSm,
  },
  mobileMainTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  mobileDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  mobileHeaderButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mobileIconBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  mobileExportBtn: {
    height: 32,
    paddingHorizontal: SPACING.spaceSm + 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surface,
  },
  mobileScroll: {
    flex: 1,
  },
  mobileScrollContent: {
    padding: SPACING.spaceBase,
    gap: SPACING.spaceLg,
    paddingBottom: 90,
  },
  mobileToast: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm + 2,
  },
  mobileBottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 8,
  },
  bottomNavItems: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: 440,
    marginHorizontal: "auto",
    width: "100%",
  },
  bottomTabActive: {
    alignItems: "center",
    gap: 2,
    paddingHorizontal: SPACING.spaceBase,
  },
  bottomTabLabelActive: {
    fontSize: 10,
    fontWeight: "600",
  },
  bottomTab: {
    alignItems: "center",
    gap: 2,
    paddingHorizontal: SPACING.spaceBase,
  },
  bottomTabLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});
