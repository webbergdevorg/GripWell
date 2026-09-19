/**
 * Gripwell - Owner: User Management Embed
 * Inline tab component for creating staff accounts and assigning roles.
 * Owner-only feature — supports Supervisor, Office Admin, and Owner roles.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { UserRole } from "../../types/roles";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { TextInput } from "../ui/TextInput";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hub: string;
  createdAt: string;
  status: "active" | "inactive";
}

const MOCK_USERS: StaffUser[] = [
  {
    id: "usr-001",
    name: "Rajesh Kumar",
    email: "supervisor@gripwell.io",
    role: "supervisor",
    hub: "Mumbai Central Hub",
    createdAt: "12 Sep 2026",
    status: "active",
  },
  {
    id: "usr-002",
    name: "M. Vance",
    email: "office@gripwell.io",
    role: "office",
    hub: "Chicago Metro Hub",
    createdAt: "01 Aug 2026",
    status: "active",
  },
  {
    id: "usr-003",
    name: "S. Rajesh",
    email: "owner@gripwell.io",
    role: "owner",
    hub: "Executive Headquarters",
    createdAt: "15 Jan 2026",
    status: "active",
  },
];

const ROLE_OPTIONS: {
  id: UserRole;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: "supervisor",
    label: "Supervisor",
    icon: "local-shipping",
    desc: "Dispatch, gate pass & bay loading access",
  },
  {
    id: "office",
    label: "Office Admin",
    icon: "receipt-long",
    desc: "Billing, credit ledger & advance payments",
  },
  {
    id: "owner",
    label: "Owner Console",
    icon: "query-stats",
    desc: "Full fiscal oversight & all workspace access",
  },
];

const ROLE_BADGE_MAP: Record<UserRole, string> = {
  supervisor: "ready_for_seal",
  office: "credit",
  owner: "settled",
};

export interface UserManagementEmbedProps {
  isDesktop?: boolean;
}

export const UserManagementEmbed: React.FC<UserManagementEmbedProps> = ({
  isDesktop = false,
}) => {
  const [users, setUsers] = useState<StaffUser[]>(MOCK_USERS);
  const [showForm, setShowForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formHub, setFormHub] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("supervisor");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormHub("");
    setFormRole("supervisor");
    setFormError(null);
    setShowPassword(false);
  };

  const handleSave = () => {
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Full name is required.");
      return;
    }
    if (!formEmail.trim() || !formEmail.includes("@")) {
      setFormError("A valid work email is required.");
      return;
    }
    if (formPassword.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === formEmail.toLowerCase())) {
      setFormError("An account with this email already exists.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const newUser: StaffUser = {
        id: `usr-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        role: formRole,
        hub: formHub.trim() || "—",
        createdAt: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "active",
      };
      setUsers((prev) => [newUser, ...prev]);
      resetForm();
      setShowForm(false);
      setIsSaving(false);
      showToast(
        `${newUser.name} added as ${ROLE_OPTIONS.find((r) => r.id === formRole)?.label}`,
      );
    }, 600);
  };

  const handleDeactivate = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const msg = `Deactivate ${user.name}'s account?`;
    if (Platform.OS === "web") {
      if (window.confirm?.(msg)) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, status: "inactive" as const } : u,
          ),
        );
        showToast(`${user.name}'s account deactivated`);
      }
    } else {
      Alert.alert("Deactivate Account", msg, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: () => {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === userId ? { ...u, status: "inactive" as const } : u,
              ),
            );
            showToast(`${user.name}'s account deactivated`);
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Toast */}
      {toastMessage && (
        <View style={styles.toast}>
          <MaterialIcons
            name="check-circle"
            size={14}
            color={COLORS.statusPaidText}
          />
          <Text variant="bodySm" style={styles.toastText}>
            {toastMessage}
          </Text>
        </View>
      )}

      {/* Section Header */}
      {isDesktop ? (
        <View style={styles.desktopTitleSection}>
          <View>
            <View style={styles.desktopBreadcrumbSmall}>
              <Text variant="labelSm" style={styles.breadcrumbSmallText}>
                SETTINGS
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={14}
                color={COLORS.textMuted}
              />
              <Text variant="labelSm" style={styles.breadcrumbSmallActive}>
                STAFF & ROLES
              </Text>
            </View>
            <Text variant="headlineXl" style={styles.desktopMainHeading}>
              User Management
            </Text>
            <Text variant="bodyMd" color={COLORS.textSecondary}>
              Create staff accounts and assign workspace access (Supervisor,
              Office Admin, Owner)
            </Text>
          </View>

          <Button
            title={showForm ? "Close Form" : "Add New User"}
            variant={showForm ? "outline" : "primary"}
            size="sm"
            icon={showForm ? "close" : "person-add"}
            onPress={() => {
              if (showForm) resetForm();
              setShowForm((v) => !v);
            }}
          />
        </View>
      ) : (
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="group" size={18} color={COLORS.primary} />
            <Text variant="headlineSm" style={styles.sectionTitle}>
              User Management
            </Text>
          </View>
          <Text
            variant="bodySm"
            color={COLORS.textSecondary}
            style={styles.sectionSub}
          >
            Create staff accounts and assign workspace access
          </Text>
        </View>
      )}

      {/* Summary Pill Row */}
      <View style={styles.pillRow}>
        {ROLE_OPTIONS.map((r) => {
          const count = users.filter(
            (u) => u.role === r.id && u.status === "active",
          ).length;
          return (
            <View key={r.id} style={styles.summaryPill}>
              <MaterialIcons
                name={r.icon as any}
                size={13}
                color={COLORS.textSecondary}
              />
              <Text variant="labelSm" style={styles.pillCount}>
                {count}
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={styles.pillLabel}
                numberOfLines={1}
              >
                {r.label}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Add User Button (Mobile Only) */}
      {!isDesktop && (
        <Button
          title={showForm ? "Cancel" : "Add New User"}
          variant={showForm ? "ghost" : "primary"}
          size="sm"
          icon={showForm ? "close" : "person-add"}
          onPress={() => {
            if (showForm) resetForm();
            setShowForm((v) => !v);
          }}
          fullWidth
        />
      )}

      {/* Add User Form */}
      {showForm && (
        <View style={styles.formCard}>
          <Text variant="labelMd" style={styles.formTitle}>
            New Staff Account
          </Text>

          {formError && (
            <View style={styles.errorBox}>
              <MaterialIcons
                name="error-outline"
                size={14}
                color={COLORS.statusOverdueFill}
              />
              <Text
                variant="bodySm"
                color={COLORS.statusOverdueText}
                style={styles.errorText}
              >
                {formError}
              </Text>
            </View>
          )}

          {/* Role Selector */}
          <View style={styles.fieldGroup}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.fieldLabel}
            >
              ASSIGN ROLE
            </Text>
            <View style={styles.roleOptions}>
              {ROLE_OPTIONS.map((r) => {
                const active = formRole === r.id;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => setFormRole(r.id)}
                    style={[
                      styles.roleOption,
                      active
                        ? styles.roleOptionActive
                        : styles.roleOptionInactive,
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                  >
                    <View style={styles.roleOptionTop}>
                      <MaterialIcons
                        name={r.icon as any}
                        size={14}
                        color={active ? COLORS.primary : COLORS.textMuted}
                      />
                      <Text
                        variant="labelSm"
                        style={[
                          styles.roleOptionLabel,
                          active && styles.roleOptionLabelActive,
                        ]}
                        numberOfLines={1}
                      >
                        {r.label}
                      </Text>
                      {active && (
                        <MaterialIcons
                          name="check-circle"
                          size={14}
                          color={COLORS.primary}
                        />
                      )}
                    </View>
                    <Text
                      variant="bodySm"
                      color={COLORS.textMuted}
                      style={styles.roleOptionDesc}
                      numberOfLines={2}
                    >
                      {r.desc}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.fieldLabel}
            >
              FULL NAME
            </Text>
            <TextInput
              value={formName}
              onChangeText={setFormName}
              placeholder="e.g. Arun Sharma"
              autoCapitalize="words"
              size="md"
            />
          </View>

          {/* Work Email */}
          <View style={styles.fieldGroup}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.fieldLabel}
            >
              WORK EMAIL
            </Text>
            <TextInput
              value={formEmail}
              onChangeText={setFormEmail}
              placeholder="e.g. arun@gripwell.io"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              size="md"
            />
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <View style={styles.passwordLabelRow}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.fieldLabel}
              >
                TEMPORARY PASSWORD
              </Text>
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                style={styles.showHideBtn}
              >
                <Text variant="labelSm" color={COLORS.secondary}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>
            <TextInput
              value={formPassword}
              onChangeText={setFormPassword}
              placeholder="Min 6 characters"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              size="md"
            />
          </View>

          {/* Hub / Location */}
          <View style={styles.fieldGroup}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.fieldLabel}
            >
              HUB / LOCATION (OPTIONAL)
            </Text>
            <TextInput
              value={formHub}
              onChangeText={setFormHub}
              placeholder="e.g. Mumbai Central Hub"
              autoCapitalize="words"
              size="md"
            />
          </View>

          <Button
            title={isSaving ? "Creating Account..." : "Create Account"}
            variant="primary"
            size="md"
            icon="check"
            onPress={handleSave}
            loading={isSaving}
            fullWidth
          />
        </View>
      )}

      {/* User List */}
      <View style={styles.userListHeader}>
        <Text
          variant="labelSm"
          color={COLORS.textSecondary}
          style={styles.listTitle}
        >
          STAFF ACCOUNTS ({users.filter((u) => u.status === "active").length}{" "}
          active)
        </Text>
      </View>

      <View style={[styles.userList, isDesktop && styles.desktopUserList]}>
        {users.map((user) => (
          <View
            key={user.id}
            style={[
              styles.userCard,
              isDesktop && styles.desktopUserCard,
              user.status === "inactive" && styles.userCardInactive,
            ]}
          >
            <View style={styles.userCardTop}>
              <View style={styles.avatarCircle}>
                <Text variant="labelSm" style={styles.avatarText}>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text variant="labelMd" style={styles.userName}>
                    {user.name}
                  </Text>
                  {user.status === "inactive" && (
                    <Badge label="INACTIVE" variant="void" />
                  )}
                </View>
                <Text
                  variant="bodySm"
                  color={COLORS.textMuted}
                  style={styles.userEmail}
                >
                  {user.email}
                </Text>
              </View>
            </View>

            <View style={styles.userCardMeta}>
              <Badge
                label={
                  ROLE_OPTIONS.find((r) => r.id === user.role)?.label ||
                  user.role
                }
                variant={ROLE_BADGE_MAP[user.role] as any}
              />
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={styles.userHub}
                numberOfLines={1}
              >
                {user.hub}
              </Text>
            </View>

            <View style={styles.userCardFooter}>
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={styles.userDate}
              >
                Added {user.createdAt}
              </Text>
              {user.status === "active" && (
                <Pressable
                  onPress={() => handleDeactivate(user.id)}
                  style={({ pressed }: any) => [
                    styles.deactivateBtn,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                >
                  <MaterialIcons
                    name="block"
                    size={13}
                    color={COLORS.statusOverdueFill}
                  />
                  <Text
                    variant="labelSm"
                    color={COLORS.statusOverdueFill}
                    style={{ fontSize: 11 }}
                  >
                    Deactivate
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.spaceMd,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm + 2,
  },
  toastText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  sectionHeader: { gap: 2 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sectionTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSub: { fontSize: 12, marginLeft: 24 },
  pillRow: {
    flexDirection: "row",
    gap: SPACING.spaceSm,
  },
  summaryPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.spaceSm,
    paddingVertical: 6,
  },
  pillCount: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  pillLabel: { fontSize: 10, flex: 1 },

  // Form
  formCard: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceMd,
    gap: SPACING.spaceMd,
  },
  formTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.statusOverdueBg,
    borderColor: COLORS.statusOverdueBorder,
    borderWidth: 1,
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm,
  },
  errorText: { flex: 1, fontSize: 12 },
  fieldGroup: { gap: 5 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  showHideBtn: {
    paddingHorizontal: 4,
    ...Platform.select({ web: { cursor: "pointer" } }),
  },

  // Role Options
  roleOptions: { gap: SPACING.spaceSm },
  roleOption: {
    borderWidth: 1,
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm + 2,
    gap: 3,
  },
  roleOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(15,23,42,0.04)",
  },
  roleOptionInactive: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  roleOptionTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  roleOptionLabel: {
    flex: 1,
    fontWeight: "600",
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  roleOptionLabelActive: { color: COLORS.textPrimary },
  roleOptionDesc: { fontSize: 11, lineHeight: 15, marginLeft: 20 },

  // User list
  userListHeader: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: SPACING.spaceSm,
  },
  listTitle: { fontSize: 10, fontWeight: "700", letterSpacing: 0.4 },
  userList: { gap: SPACING.spaceSm },
  userCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceSm + 2,
    gap: SPACING.spaceSm,
  },
  userCardInactive: {
    opacity: 0.55,
  },
  userCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary },
  userInfo: { flex: 1, gap: 1 },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  userName: { fontWeight: "700", color: COLORS.textPrimary, fontSize: 13 },
  userEmail: { fontSize: 11 },
  userCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
  },
  userHub: { flex: 1, fontSize: 11 },
  userCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userDate: { fontSize: 11 },
  deactivateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.statusOverdueBorder,
    ...Platform.select({ web: { cursor: "pointer" } }),
  },
  pressed: { opacity: 0.7 },
  desktopTitleSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: SPACING.spaceBase,
  },
  desktopBreadcrumbSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  breadcrumbSmallText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  breadcrumbSmallActive: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  desktopMainHeading: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  desktopUserList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.spaceMd,
  },
  desktopUserCard: {
    width: "48.5%",
  },
});
