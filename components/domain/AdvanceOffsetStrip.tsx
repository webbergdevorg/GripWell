/**
 * Gripwell - Domain Component: AdvanceOffsetStrip
 * Clean & minimal advance offset bar from Stitch.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { formatINR } from "../../utils/currency";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";
import { TextInput } from "../ui/TextInput";

export interface AdvanceOffsetStripProps {
  availableAmount: number;
  appliedAmount: number;
  voucherId?: string;
  onApplyAdvance: (amount: number) => void;
  onRemoveAdvance: () => void;
  isMobile?: boolean;
}

export const AdvanceOffsetStrip: React.FC<AdvanceOffsetStripProps> = ({
  availableAmount,
  appliedAmount,
  voucherId = "ADV-1",
  onApplyAdvance,
  onRemoveAdvance,
  isMobile = false,
}) => {
  const [inputVal, setInputVal] = useState(
    appliedAmount > 0 ? String(appliedAmount) : String(availableAmount),
  );
  const isApplied = appliedAmount > 0;

  useEffect(() => {
    setInputVal(
      appliedAmount > 0 ? String(appliedAmount) : String(availableAmount),
    );
  }, [appliedAmount, availableAmount]);

  if (isMobile) {
    return (
      <View style={styles.mobileContainer}>
        <View style={styles.mobileLeft}>
          <MaterialIcons
            name="account-balance-wallet"
            size={18}
            color={COLORS.textMuted}
          />
          <View>
            <Text
              variant="labelSm"
              color={COLORS.textSecondary}
              style={styles.mobileTitle}
            >
              Advance pool available
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.mobileSub}
            >
              {formatINR(availableAmount, false)} on deposit ({voucherId})
            </Text>
          </View>
        </View>

        <Pressable
          disabled={!isApplied && availableAmount <= 0}
          onPress={() => {
            if (isApplied) {
              onRemoveAdvance();
            } else {
              onApplyAdvance(availableAmount);
            }
          }}
          style={[
            styles.mobileToggle,
            !isApplied && availableAmount <= 0 && { opacity: 0.5 },
          ]}
        >
          <Text
            variant="labelSm"
            color={isApplied ? COLORS.textSecondary : COLORS.secondary}
            style={styles.mobileToggleText}
          >
            {isApplied
              ? `Remove ${formatINR(appliedAmount, false)}`
              : `Apply ${formatINR(availableAmount, false)}`}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.desktopContainer}>
      <View>
        <Text
          variant="labelSm"
          color={COLORS.textPrimary}
          style={styles.desktopTitle}
        >
          Available Customer Advance: {formatINR(availableAmount)}
        </Text>
        <Text variant="bodySm" color={COLORS.textSecondary}>
          Deposit voucher {voucherId} available for offset
        </Text>
      </View>

      <View style={styles.desktopRight}>
        <View style={styles.inputWrap}>
          <TextInput
            size="sm"
            prefix="₹"
            value={inputVal}
            onChangeText={setInputVal}
            keyboardType="numeric"
            mono
            containerStyle={styles.textInputContainer}
          />
        </View>
        <Button
          variant={isApplied ? "outline" : "secondary"}
          size="sm"
          title={isApplied ? "Update" : "Apply"}
          disabled={!isApplied && availableAmount <= 0}
          onPress={() => {
            const num = parseFloat(inputVal.replace(/[^0-9.]/g, "")) || 0;
            onApplyAdvance(Math.max(0, Math.min(num, availableAmount)));
          }}
        />
        {isApplied && (
          <Button
            variant="ghost"
            size="sm"
            title="Remove"
            onPress={() => {
              onRemoveAdvance();
              setInputVal(String(availableAmount));
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.spaceSm + 2,
    paddingHorizontal: SPACING.spaceMd + 2,
  },
  desktopTitle: {
    fontWeight: "600",
    marginBottom: 2,
  },
  desktopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
  },
  inputWrap: {
    width: 96,
  },
  textInputContainer: {
    height: 28,
  },
  mobileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.spaceSm,
    paddingHorizontal: SPACING.spaceMd,
  },
  mobileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
  },
  mobileTitle: {
    fontWeight: "600",
  },
  mobileSub: {
    fontSize: 11,
  },
  mobileToggle: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  mobileToggleText: {
    fontWeight: "600",
  },
});
