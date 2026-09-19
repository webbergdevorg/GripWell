/**
 * Gripwell - Switch Role Authentication Modal
 * Displays when a user attempts to access a higher-tiered role workspace.
 * Requires authenticating with that role's credentials before granting access.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useRoleContext } from "../../hooks/useRoleContext";
import {
  DEV_ACCOUNTS,
  validateCredentials,
} from "../../services/auth/devCredentials";
import { UserRole } from "../../types/roles";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { TextInput } from "../ui/TextInput";

export interface SwitchRoleModalProps {
  visible: boolean;
  targetRole: UserRole | null;
  onClose: () => void;
  onSuccess: (newRole: UserRole) => void;
}

export const SwitchRoleModal: React.FC<SwitchRoleModalProps> = ({
  visible,
  targetRole,
  onClose,
  onSuccess,
}) => {
  const { staff, login, quickLogin } = useRoleContext();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync default target email when modal opens for targetRole
  React.useEffect(() => {
    if (targetRole && visible) {
      const targetAcc = DEV_ACCOUNTS[targetRole];
      setIdentifier(targetAcc?.email || "");
      setPassword("");
      setError(null);
      setShowPassword(false);
    }
  }, [targetRole, visible]);

  if (!visible || !targetRole) return null;

  const targetAccount = DEV_ACCOUNTS[targetRole];
  const targetLabel = targetAccount?.roleLabel || targetRole;

  const handleAuthenticate = async () => {
    setError(null);
    setIsVerifying(true);

    try {
      const res = validateCredentials(identifier, password);
      if (!res.success || !res.account) {
        setError(res.error || "Invalid credentials for this workspace.");
        setIsVerifying(false);
        return;
      }

      if (res.account.role !== targetRole) {
        setError(
          `These credentials belong to ${res.account.roleLabel}. Please enter credentials for ${targetLabel}.`,
        );
        setIsVerifying(false);
        return;
      }

      await login(identifier, password);
      onSuccess(targetRole);
      onClose();
    } catch {
      setError("An unexpected authentication error occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDevQuickVerify = () => {
    setError(null);
    quickLogin(targetRole);
    onSuccess(targetRole);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.iconBadge}>
              <MaterialIcons name="lock" size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="headlineSm" style={styles.title}>
                Elevated Access Required
              </Text>
              <Text variant="bodySm" color={COLORS.textSecondary}>
                Switching to {targetLabel} Workspace
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
            >
              <MaterialIcons name="close" size={18} color={COLORS.textMuted} />
            </Pressable>
          </View>

          {/* Context Notice */}
          <View style={styles.noticeBox}>
            <Text
              variant="bodySm"
              color={COLORS.textSecondary}
              style={styles.noticeText}
            >
              Currently signed in as{" "}
              <Text variant="labelSm" style={{ color: COLORS.textPrimary }}>
                {staff.name}
              </Text>{" "}
              ({staff.role}). To access the restricted{" "}
              <Text variant="labelSm" style={{ color: COLORS.textPrimary }}>
                {targetLabel}
              </Text>{" "}
              console, authenticate with valid {targetLabel} credentials.
            </Text>
          </View>

          {/* Error Banner */}
          {error && (
            <View style={styles.errorBox}>
              <MaterialIcons
                name="error-outline"
                size={16}
                color={COLORS.statusOverdueFill}
              />
              <Text
                variant="bodySm"
                color={COLORS.statusOverdueText}
                style={styles.errorText}
              >
                {error}
              </Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.formGroup}>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.inputLabel}
            >
              {targetLabel.toUpperCase()} EMAIL / USERNAME
            </Text>
            <TextInput
              value={identifier}
              onChangeText={setIdentifier}
              placeholder={`e.g. ${targetAccount?.email || "username"}`}
              autoCapitalize="none"
              autoCorrect={false}
              size="md"
              onSubmitEditing={handleAuthenticate}
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.passwordRow}>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.inputLabel}
              >
                PASSWORD
              </Text>
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showHideBtn}
                accessibilityRole="button"
              >
                <Text variant="labelSm" color={COLORS.secondary}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              size="md"
              onSubmitEditing={handleAuthenticate}
            />
          </View>

          {/* Dev Quick Test Box */}
          <View style={styles.devSection}>
            <View style={styles.devHeader}>
              <Badge label="TESTING HELPER" variant="neutral" />
              <Text
                variant="bodySm"
                color={COLORS.textMuted}
                style={{ fontSize: 11 }}
              >
                Pass: {targetAccount?.password}
              </Text>
            </View>
            <Button
              title={`1-Click Verify as ${targetLabel}`}
              variant="outline"
              size="sm"
              icon="verified-user"
              onPress={handleDevQuickVerify}
              fullWidth
              style={styles.devBtn}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <Button
              title="Cancel"
              variant="ghost"
              size="md"
              onPress={onClose}
              style={{ flex: 1 }}
            />
            <Button
              title="Authenticate & Switch"
              variant="primary"
              size="md"
              icon="check"
              onPress={handleAuthenticate}
              loading={isVerifying}
              style={{ flex: 1.5 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Dimmed slate 900
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.spaceBase,
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.spaceLg,
    ...Platform.select({
      web: {
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
      },
    }),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: SPACING.spaceMd,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  noticeBox: {
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm + 2,
    marginBottom: SPACING.spaceMd,
  },
  noticeText: {
    fontSize: 12,
    lineHeight: 18,
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
    marginBottom: SPACING.spaceMd,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
  },
  formGroup: {
    marginBottom: SPACING.spaceSm + 2,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  showHideBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  devSection: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm,
    marginTop: 4,
    marginBottom: SPACING.spaceMd,
    gap: 6,
  },
  devHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  devBtn: {
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    marginTop: SPACING.spaceSm,
  },
});
