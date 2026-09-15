/**
 * Gripwell - Enterprise Terminal Authentication & Login Screen
 * Aligned with UI/UX Pro Max guidelines (Swiss Minimalism, WCAG 2.2 AA compliant).
 * Supports standard authentication and 1-Click Developer Testing credentials.
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Text } from "../components/ui/Text";
import { TextInput } from "../components/ui/TextInput";
import { COLORS } from "../constants/colors";
import { RADIUS, SPACING } from "../constants/spacing";
import { useResponsive } from "../hooks/useResponsive";
import { useRoleContext } from "../hooks/useRoleContext";
import { DEV_ACCOUNTS } from "../services/auth/devCredentials";
import { UserRole } from "../types/roles";

export default function LoginScreen() {
  const { isDesktop, isMobile } = useResponsive();
  const insets = useSafeAreaInsets();
  const { login, quickLogin } = useRoleContext();

  // Form State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Navigate according to authenticated role
  const navigateToRole = (role: UserRole) => {
    if (role === "supervisor") {
      router.replace("/(supervisor)/dispatch" as any);
    } else if (role === "owner") {
      router.replace("/(owner)/dashboard" as any);
    } else {
      router.replace("/(office)/billing" as any);
    }
  };

  const handleStandardSubmit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await login(identifier, password);
      if (result.success) {
        // Find which role this matches to route accurately
        const cleanId = identifier.trim().toLowerCase();
        const matched = Object.values(DEV_ACCOUNTS).find(
          (acc) =>
            acc.email.toLowerCase() === cleanId ||
            acc.username.toLowerCase() === cleanId ||
            acc.role.toLowerCase() === cleanId,
        );
        navigateToRole(matched?.role || "office");
      } else {
        setErrorMessage(
          result.error || "Authentication failed. Check your credentials.",
        );
      }
    } catch {
      setErrorMessage("An unexpected network or system error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    setErrorMessage(null);
    quickLogin(role);
    navigateToRole(role);
  };

  const handleAutofill = (role: UserRole) => {
    const acc = DEV_ACCOUNTS[role];
    if (acc) {
      setIdentifier(acc.email);
      setPassword(acc.password);
      setErrorMessage(null);
    }
  };

  return (
    <View
      style={[styles.screenContainer, { paddingTop: Math.max(insets.top, 0) }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[styles.mainWrapper, isDesktop && styles.desktopWrapper]}
          >
            {/* LEFT HERO PANEL (Visible on Desktop / Tablets) */}
            {isDesktop && (
              <View style={styles.heroPanel}>
                <View style={styles.heroHeader}>
                  <View style={styles.brandRow}>
                    <View style={styles.brandIconWrapper}>
                      <MaterialIcons
                        name="local-shipping"
                        size={22}
                        color="#FFFFFF"
                      />
                    </View>
                    <Text variant="headlineMd" style={styles.brandTitle}>
                      Gripwell
                    </Text>
                  </View>
                  <View style={styles.telemetryPill}>
                    <View style={styles.pulsingDot} />
                    <Text variant="labelSm" color={COLORS.statusPaidText}>
                      Terminal Gateway v2.4 • Operational
                    </Text>
                  </View>
                </View>

                <View style={styles.heroBody}>
                  <Text variant="headlineXl" style={styles.heroHeading}>
                    Integrated Dispatch & Fiscal Operations Portal
                  </Text>
                  <Text
                    variant="bodyLg"
                    color={COLORS.textSecondary}
                    style={styles.heroSubheading}
                  >
                    Secure role-based access for logistics terminal dock
                    supervisors, administrative billing officers, and executive
                    fiscal management.
                  </Text>

                  {/* Feature Pillars */}
                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <View style={styles.featureBullet}>
                        <MaterialIcons
                          name="qr-code-scanner"
                          size={16}
                          color={COLORS.secondary}
                        />
                      </View>
                      <View style={styles.featureTextCol}>
                        <Text variant="labelMd" style={styles.featureTitle}>
                          Dock Supervisor Workspace
                        </Text>
                        <Text variant="bodySm" color={COLORS.textSecondary}>
                          Bay loading sequence, cargo photo capture, and
                          instantaneous gate pass issuance.
                        </Text>
                      </View>
                    </View>

                    <View style={styles.featureItem}>
                      <View style={styles.featureBullet}>
                        <MaterialIcons
                          name="receipt-long"
                          size={16}
                          color={COLORS.secondary}
                        />
                      </View>
                      <View style={styles.featureTextCol}>
                        <Text variant="labelMd" style={styles.featureTitle}>
                          Office Admin Desk
                        </Text>
                        <Text variant="bodySm" color={COLORS.textSecondary}>
                          Multi-mode payment settlement, customer credit ledger,
                          and advance pool offset strip.
                        </Text>
                      </View>
                    </View>

                    <View style={styles.featureItem}>
                      <View style={styles.featureBullet}>
                        <MaterialIcons
                          name="insights"
                          size={16}
                          color={COLORS.secondary}
                        />
                      </View>
                      <View style={styles.featureTextCol}>
                        <Text variant="labelMd" style={styles.featureTitle}>
                          Owner Fiscal Dashboard
                        </Text>
                        <Text variant="bodySm" color={COLORS.textSecondary}>
                          Aggregated gross run-rate, overdue aging analysis, and
                          automated bank reconciliation.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.heroFooter}>
                  <MaterialIcons
                    name="lock"
                    size={14}
                    color={COLORS.textMuted}
                  />
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={styles.securityText}
                  >
                    Encrypted TLS 1.3 • Multi-Dock Sync • ISO 27001 Protocol
                  </Text>
                </View>
              </View>
            )}

            {/* RIGHT AUTH CARD */}
            <View
              style={[styles.authPanel, isDesktop && styles.authPanelDesktop]}
            >
              <Card style={styles.authCard} padding="spaceXl">
                {/* Mobile Brand Header */}
                {!isDesktop && (
                  <View style={styles.mobileBrandRow}>
                    <View style={styles.brandIconWrapper}>
                      <MaterialIcons
                        name="local-shipping"
                        size={20}
                        color="#FFFFFF"
                      />
                    </View>
                    <View>
                      <Text variant="headlineSm" style={styles.brandTitle}>
                        Gripwell
                      </Text>
                      <Text variant="labelSm" color={COLORS.textMuted}>
                        Logistics Terminal Gateway
                      </Text>
                    </View>
                  </View>
                )}

                {/* Form Title */}
                <View style={styles.formHeader}>
                  <Text variant="headlineMd" style={styles.formTitle}>
                    Sign In to Terminal
                  </Text>
                  <Text
                    variant="bodySm"
                    color={COLORS.textSecondary}
                    style={styles.formSubtitle}
                  >
                    Enter your staff credentials or select a developer test role
                    below.
                  </Text>
                </View>

                {/* Error Banner */}
                {errorMessage && (
                  <View style={styles.errorBanner}>
                    <MaterialIcons
                      name="error-outline"
                      size={18}
                      color={COLORS.statusOverdueFill}
                    />
                    <Text
                      variant="bodySm"
                      color={COLORS.statusOverdueText}
                      style={styles.errorText}
                    >
                      {errorMessage}
                    </Text>
                  </View>
                )}

                {/* Input 1: Username / Work Email */}
                <View style={styles.fieldGroup}>
                  <Text
                    variant="labelSm"
                    color={COLORS.textSecondary}
                    style={styles.fieldLabel}
                  >
                    WORK EMAIL OR USERNAME
                  </Text>
                  <TextInput
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="e.g. supervisor@gripwell.io or supervisor"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                    textContentType="username"
                    size="md"
                    onSubmitEditing={handleStandardSubmit}
                  />
                </View>

                {/* Input 2: Password with Show/Hide toggle */}
                <View style={styles.fieldGroup}>
                  <View style={styles.passwordLabelRow}>
                    <Text
                      variant="labelSm"
                      color={COLORS.textSecondary}
                      style={styles.fieldLabel}
                    >
                      PASSWORD
                    </Text>
                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.showPassPressable}
                      accessibilityRole="button"
                      accessibilityLabel={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <MaterialIcons
                        name={showPassword ? "visibility-off" : "visibility"}
                        size={15}
                        color={COLORS.secondary}
                      />
                      <Text variant="labelSm" color={COLORS.secondary}>
                        {showPassword ? "Hide" : "Show"}
                      </Text>
                    </Pressable>
                  </View>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter terminal password"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    textContentType="password"
                    size="md"
                    onSubmitEditing={handleStandardSubmit}
                  />
                </View>

                {/* Remember Me Checkbox */}
                <Pressable
                  onPress={() => setRememberTerminal(!rememberTerminal)}
                  style={styles.rememberRow}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: rememberTerminal }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberTerminal && styles.checkboxActive,
                    ]}
                  >
                    {rememberTerminal && (
                      <MaterialIcons name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  <Text variant="bodySm" color={COLORS.textSecondary}>
                    Remember terminal workstation
                  </Text>
                </Pressable>

                {/* Submit Button */}
                <Button
                  title="Sign In to Terminal"
                  variant="primary"
                  size="md"
                  icon="login"
                  onPress={handleStandardSubmit}
                  loading={isLoading}
                  fullWidth
                  style={styles.submitBtn}
                />

                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text
                    variant="labelSm"
                    color={COLORS.textMuted}
                    style={styles.dividerText}
                  >
                    DEVELOPMENT & TESTING CREDENTIALS
                  </Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* DEV CREDENTIALS QUICK HUB */}
                <View style={styles.devHubContainer}>
                  <Text
                    variant="bodySm"
                    color={COLORS.textSubtle}
                    style={styles.devHubSubtitle}
                  >
                    Select a pre-configured role below to test the application
                    instantly:
                  </Text>

                  {/* Dev Role Items */}
                  {(["supervisor", "office", "owner"] as UserRole[]).map(
                    (role) => {
                      const acc = DEV_ACCOUNTS[role];
                      const isSupervisor = role === "supervisor";
                      const isOffice = role === "office";

                      const badgeVariant = isSupervisor
                        ? "ready_for_seal"
                        : isOffice
                          ? "credit"
                          : "settled";

                      const roleIcon = isSupervisor
                        ? "local-shipping"
                        : isOffice
                          ? "receipt-long"
                          : "query-stats";

                      return (
                        <View key={role} style={styles.devRoleCard}>
                          <View style={styles.devRoleHeader}>
                            <View style={styles.devRoleLeft}>
                              <View style={styles.devIconBadge}>
                                <MaterialIcons
                                  name={roleIcon as any}
                                  size={15}
                                  color={COLORS.primary}
                                />
                              </View>
                              <View>
                                <View style={styles.devRoleTitleRow}>
                                  <Text
                                    variant="labelMd"
                                    style={styles.devRoleTitle}
                                  >
                                    {acc.roleLabel}
                                  </Text>
                                  <Badge
                                    label={acc.profile.hub}
                                    variant={badgeVariant as any}
                                  />
                                </View>
                                <Text
                                  variant="bodySm"
                                  color={COLORS.textMuted}
                                  style={styles.devCredsText}
                                >
                                  {acc.email} • {acc.password}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <Text
                            variant="bodySm"
                            color={COLORS.textSecondary}
                            style={styles.devRoleDesc}
                          >
                            {acc.description}
                          </Text>

                          <View style={styles.devActionsRow}>
                            <Button
                              title="Auto-Fill"
                              variant="outline"
                              size="sm"
                              icon="edit"
                              onPress={() => handleAutofill(role)}
                              style={styles.devActionBtn}
                            />
                            <Button
                              title={`Sign In as ${acc.roleLabel}`}
                              variant="secondary"
                              size="sm"
                              icon="arrow-forward"
                              onPress={() => handleQuickLogin(role)}
                              style={[
                                styles.devActionBtn,
                                styles.devPrimaryActionBtn,
                              ]}
                            />
                          </View>
                        </View>
                      );
                    },
                  )}
                </View>
              </Card>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.canvas, // Slate 50
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.spaceBase,
  },
  mainWrapper: {
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
    marginVertical: "auto",
  },
  desktopWrapper: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: SPACING.spaceXl,
  },

  // HERO PANEL
  heroPanel: {
    flex: 1.1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.spaceXl,
    justifyContent: "space-between",
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.space2xl,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary, // Slate 900
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  telemetryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.statusPaidBg,
    borderColor: COLORS.statusPaidBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.statusPaidFill, // Emerald 600
  },
  heroBody: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: SPACING.spaceLg,
  },
  heroHeading: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    lineHeight: 38,
    marginBottom: SPACING.spaceMd,
  },
  heroSubheading: {
    lineHeight: 22,
    marginBottom: SPACING.space2xl,
  },
  featureList: {
    gap: SPACING.spaceLg,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.spaceMd,
  },
  featureBullet: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.secondaryLight,
    borderWidth: 1,
    borderColor: COLORS.secondaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitle: {
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginBottom: 2,
  },
  heroFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: SPACING.spaceLg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  securityText: {
    fontSize: 11,
  },

  // AUTH PANEL & CARD
  authPanel: {
    width: "100%",
  },
  authPanelDesktop: {
    flex: 1,
    maxWidth: 500,
  },
  authCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  mobileBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: SPACING.spaceLg,
  },
  formHeader: {
    marginBottom: SPACING.spaceLg,
  },
  formTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  formSubtitle: {
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.statusOverdueBg,
    borderColor: COLORS.statusOverdueBorder,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceSm + 2,
    paddingVertical: SPACING.spaceSm,
    marginBottom: SPACING.spaceMd,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
  },
  fieldGroup: {
    marginBottom: SPACING.spaceMd,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  showPassPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    marginBottom: SPACING.spaceLg,
    ...Platform.select({
      web: { cursor: "pointer", userSelect: "none" },
    }),
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderDashed,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  submitBtn: {
    marginBottom: SPACING.spaceLg,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    marginVertical: SPACING.spaceSm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // DEV CREDENTIALS HUB
  devHubContainer: {
    marginTop: SPACING.spaceSm,
    gap: SPACING.spaceSm + 2,
  },
  devHubSubtitle: {
    fontSize: 12,
    marginBottom: 2,
  },
  devRoleCard: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceSm + 2,
    gap: 6,
  },
  devRoleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  devRoleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  devIconBadge: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  devRoleTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  devRoleTitle: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  devCredsText: {
    fontSize: 11,
    marginTop: 1,
  },
  devRoleDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  devActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    marginTop: 2,
  },
  devActionBtn: {
    flex: 1,
  },
  devPrimaryActionBtn: {
    flex: 1.5,
  },
});
