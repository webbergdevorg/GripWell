/**
 * Gripwell - Screen: Digital Gate Pass Issuance & Seal Proof
 * Route: /gate-pass and /(supervisor)/gate-pass
 * Stitch Reference: Supervisor Gate Operations (#GP-04)
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GatePassCard } from "../../components/domain/GatePassCard";
import { DesktopHeader } from "../../components/navigation/DesktopHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { TextInput } from "../../components/ui/TextInput";
import { COLORS } from "../../constants/colors";
import {
  DEFAULT_GATE_PASS,
  RECENT_GATE_PASSES,
} from "../../constants/mockGatePass";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import { GatePass } from "../../types/models";

export default function GatePassScreen() {
  const { isDesktop } = useResponsive();
  const insets = useSafeAreaInsets();

  const [passes, setPasses] = useState<GatePass[]>(RECENT_GATE_PASSES);
  const [selectedPassId, setSelectedPassId] = useState<string>(
    DEFAULT_GATE_PASS.id,
  );
  const [filterTab, setFilterTab] = useState<"all" | "authorized" | "exited">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Selected pass object
  const activePass = useMemo(() => {
    return (
      passes.find((p) => p.id === selectedPassId) ||
      passes[0] ||
      DEFAULT_GATE_PASS
    );
  }, [passes, selectedPassId]);

  // Filtered passes list for sidebar / selector
  const filteredPasses = useMemo(() => {
    return passes.filter((p) => {
      const matchTab =
        filterTab === "all" ||
        (filterTab === "authorized" && p.gateStatus === "authorized") ||
        (filterTab === "exited" && p.gateStatus === "exited");

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.vehicleNumber.toLowerCase().includes(q) ||
        p.driverName.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.loadSequence.includes(q);

      return matchTab && matchQuery;
    });
  }, [passes, filterTab, searchQuery]);

  const handleStatusChange = (newStatus: "authorized" | "exited" | "held") => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === activePass.id
          ? {
              ...p,
              gateStatus: newStatus,
              exitTimestamp: newStatus === "exited" ? "02:52 PM" : undefined,
            }
          : p,
      ),
    );
  };

  const handleExportRegistry = () => {
    const msg = "Gate Pass Registry (CSV) exported successfully.";
    if (Platform.OS === "web") {
      window.alert?.(msg);
    } else {
      Alert.alert("Registry Exported", msg);
    }
  };

  // -------------------------------------------------------------
  // DESKTOP VIEW
  // -------------------------------------------------------------
  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Sticky Desktop Global Header */}
        <DesktopHeader activeSection="dispatch" />

        <ScrollView
          style={styles.desktopScroll}
          contentContainerStyle={styles.desktopScrollContent}
        >
          <View style={styles.desktopContentWrapper}>
            {/* Desktop Breadcrumb & Header Bar */}
            <View style={styles.desktopPageHeader}>
              <View>
                <View style={styles.breadcrumbRow}>
                  <Text variant="labelSm" color={COLORS.textMuted}>
                    Supervisor Workspace
                  </Text>
                  <Text variant="labelSm" color={COLORS.border}>
                    /
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.secondary}
                    style={{ fontWeight: "600" }}
                  >
                    Gate Pass Issuance
                  </Text>
                </View>
                <Text
                  variant="headlineLg"
                  color={COLORS.textPrimary}
                  style={styles.desktopTitle}
                >
                  Digital Gate Pass & Seal Verification
                </Text>
                <Text variant="bodySm" color={COLORS.textSecondary}>
                  Issue terminal gate clearance certificates, inspect
                  tamper-evident seals, and record vehicle departures.
                </Text>
              </View>

              <View style={styles.desktopHeaderActions}>
                <Button
                  title="Stage New Truck"
                  icon="local-shipping"
                  variant="outline"
                  size="sm"
                  onPress={() =>
                    router.replace("/(supervisor)/dispatch" as any)
                  }
                />
                <Button
                  title="Export Registry"
                  icon="download"
                  variant="secondary"
                  size="sm"
                  onPress={handleExportRegistry}
                />
              </View>
            </View>

            {/* Asymmetric 2-Column Workspace */}
            <View style={styles.desktopSplitLayout}>
              {/* Left Column: Issued Passes Registry (35%) */}
              <View style={styles.desktopSidebarCol}>
                <View style={styles.registryCard}>
                  {/* Registry Header */}
                  <View style={styles.registryHeader}>
                    <Text
                      variant="headlineSm"
                      color={COLORS.textPrimary}
                      style={{ fontWeight: "700" }}
                    >
                      Today's Gate Passes
                    </Text>
                    <Badge label={`${passes.length} Total`} variant="neutral" />
                  </View>

                  {/* Search Box */}
                  <View style={styles.registrySearchWrapper}>
                    <MaterialIcons
                      name="search"
                      size={16}
                      color={COLORS.textMuted}
                    />
                    <TextInput
                      placeholder="Search pass #, plate, driver..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      size="sm"
                      containerStyle={styles.registrySearchInput}
                    />
                  </View>

                  {/* Filter Tabs */}
                  <View style={styles.registryFilterTabs}>
                    {(["all", "authorized", "exited"] as const).map((tab) => {
                      const isTabActive = filterTab === tab;
                      return (
                        <Pressable
                          key={tab}
                          onPress={() => setFilterTab(tab)}
                          style={[
                            styles.filterTabPill,
                            isTabActive && styles.filterTabPillActive,
                          ]}
                        >
                          <Text
                            variant="labelSm"
                            style={[
                              styles.filterTabText,
                              isTabActive && styles.filterTabTextActive,
                            ]}
                          >
                            {tab === "all"
                              ? "All"
                              : tab === "authorized"
                                ? "Authorized"
                                : "Exited"}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {/* Passes List */}
                  <View style={styles.passesList}>
                    {filteredPasses.map((p) => {
                      const isSelected = p.id === activePass.id;
                      const isPExited = p.gateStatus === "exited";
                      return (
                        <Pressable
                          key={p.id}
                          onPress={() => setSelectedPassId(p.id)}
                          style={({ pressed }: any) => [
                            styles.passListItem,
                            isSelected && styles.passListItemActive,
                            pressed && styles.pressed,
                          ]}
                        >
                          <View style={styles.passListTop}>
                            <View style={styles.passListBadgeRow}>
                              <Text
                                variant="headlineSm"
                                color={
                                  isSelected
                                    ? COLORS.secondary
                                    : COLORS.textPrimary
                                }
                                style={{ fontWeight: "700", fontSize: 14 }}
                              >
                                #{p.id}
                              </Text>
                              <Badge
                                label={isPExited ? "Exited" : "Authorized"}
                                variant={isPExited ? "neutral" : "settled"}
                              />
                            </View>
                            <Text
                              variant="tabularData"
                              color={COLORS.textMuted}
                              style={{ fontSize: 11 }}
                            >
                              {p.issueTime}
                            </Text>
                          </View>

                          <Text
                            variant="bodyMd"
                            color={COLORS.textPrimary}
                            style={{ fontWeight: "600", marginTop: 2 }}
                            numberOfLines={1}
                          >
                            {p.customerName}
                          </Text>

                          <View style={styles.passListSubRow}>
                            <Text
                              variant="tabularData"
                              color={COLORS.textSecondary}
                              style={{ fontSize: 11 }}
                            >
                              {p.vehicleNumber}
                            </Text>
                            <Text variant="bodySm" color={COLORS.border}>
                              •
                            </Text>
                            <Text
                              variant="bodySm"
                              color={COLORS.textSecondary}
                              style={{ fontSize: 11 }}
                            >
                              {p.totalPieceCount} Pcs
                            </Text>
                            <Text variant="bodySm" color={COLORS.border}>
                              •
                            </Text>
                            <Text
                              variant="bodySm"
                              color={COLORS.textMuted}
                              style={{ fontSize: 11 }}
                            >
                              {p.dockBay}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Right Column: Active Gate Pass Card (65%) */}
              <View style={styles.desktopMainCol}>
                <GatePassCard
                  pass={activePass}
                  isDesktop={true}
                  onStatusChange={handleStatusChange}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // MOBILE VIEW
  // -------------------------------------------------------------
  return (
    <View style={styles.mobileContainer}>
      {/* Sticky Mobile Header */}
      <View
        style={[styles.mobileTopBar, { paddingTop: Math.max(insets.top, 12) }]}
      >
        {/* Title Bar with Back Nav & Status */}
        <View style={styles.mobileTitleRow}>
          <Pressable
            onPress={() => router.replace("/(supervisor)/dispatch" as any)}
            style={styles.backBtn}
            accessibilityLabel="Back to Dispatch"
          >
            <MaterialIcons
              name="arrow-back"
              size={18}
              color={COLORS.textPrimary}
            />
            <Text
              variant="bodySm"
              color={COLORS.textPrimary}
              style={{ fontWeight: "600" }}
            >
              Dispatch
            </Text>
          </Pressable>

          <Text
            variant="headlineSm"
            color={COLORS.textPrimary}
            style={{ fontWeight: "700" }}
          >
            Gate Pass #{activePass.id}
          </Text>

          <Badge
            label={activePass.gateStatus === "exited" ? "Exited" : "Clear"}
            variant={activePass.gateStatus === "exited" ? "neutral" : "settled"}
          />
        </View>

        {/* Horizontal Pass Switcher Pills */}
        <View style={styles.mobilePassSelector}>
          {passes.map((p) => {
            const isSelected = p.id === activePass.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelectedPassId(p.id)}
                style={[
                  styles.mobilePassPill,
                  isSelected && styles.mobilePassPillActive,
                ]}
              >
                <Text
                  variant="labelSm"
                  style={[
                    styles.mobilePassPillText,
                    isSelected && styles.mobilePassPillTextActive,
                  ]}
                >
                  #{p.id} ({p.vehicleNumber.split(" ")[0]})
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={styles.mobileScroll}
        contentContainerStyle={styles.mobileScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Interactive Gate Pass Card */}
        <GatePassCard
          pass={activePass}
          isDesktop={false}
          onStatusChange={handleStatusChange}
        />

        {/* Quick Yard Return Action */}
        <View style={styles.mobileFooterActions}>
          <Button
            title="Stage Another Truck"
            icon="add"
            variant="secondary"
            size="md"
            onPress={() => router.replace("/(supervisor)/dispatch" as any)}
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Desktop
  desktopContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  desktopScroll: {
    flex: 1,
  },
  desktopScrollContent: {
    paddingBottom: SPACING.space3xl,
  },
  desktopContentWrapper: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: SPACING.spaceXl,
    paddingTop: SPACING.spaceLg,
  },
  desktopPageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: SPACING.spaceXl,
    paddingBottom: SPACING.spaceBase,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  desktopTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  desktopHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  desktopSplitLayout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.spaceXl,
  },
  desktopSidebarCol: {
    width: 360,
  },
  desktopMainCol: {
    flex: 1,
  },
  registryCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: SPACING.spaceBase,
    gap: SPACING.spaceMd,
  },
  registryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  registrySearchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 8,
  },
  registrySearchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  registryFilterTabs: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: RADIUS.xs,
    padding: 2,
  },
  filterTabPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
  },
  filterTabPillActive: {
    backgroundColor: COLORS.surface,
    ...Platform.select({
      web: {
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
      },
    }),
  },
  filterTabText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  passesList: {
    gap: 6,
  },
  passListItem: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceSm + 2,
    gap: 3,
  },
  passListItemActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  passListTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passListBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  passListSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },

  // Mobile
  mobileContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mobileTopBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    paddingHorizontal: SPACING.spaceBase,
    paddingBottom: 8,
    zIndex: 50,
  },
  mobileRoleRow: {
    marginBottom: 8,
  },
  mobileTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: RADIUS.xs,
    backgroundColor: "#F1F5F9",
  },
  mobilePassSelector: {
    flexDirection: "row",
    gap: 6,
  },
  mobilePassPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  mobilePassPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mobilePassPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  mobilePassPillTextActive: {
    color: "#FFFFFF",
  },
  mobileScroll: {
    flex: 1,
  },
  mobileScrollContent: {
    padding: SPACING.spaceBase,
    paddingBottom: 40,
    gap: SPACING.spaceBase,
  },
  mobileFooterActions: {
    marginTop: SPACING.spaceSm,
  },
  pressed: {
    opacity: 0.8,
  },
});
