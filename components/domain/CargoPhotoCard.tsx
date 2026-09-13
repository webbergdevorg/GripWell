/**
 * Gripwell - Domain: CargoPhotoCard
 * Verification & Proof: Cargo Rear Seal photo component.
 * Stitch Reference: e9b548ccd0614c4189ec143905d33313 (Desktop) & cc0a7d9be25f4b6fa0ea9a227bcb3f76 (Mobile)
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { Text } from "../ui/Text";

const DEFAULT_CARGO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCnzA5KTmTL-uNnxFRJATyG8Kg1MpiMGs56A8JuHHoeHRKtBMYaxHW8Ezf6sSiXlXQfWqoJJu5HWDMMECRbClqPxJiA8-vL02HV3BZcHfVE6GIOso3w9Eluma60KoUXLs3QuJSXw5YyqCnYlYD5ri12MhWbo6DyODAoMI2dT0MmRD3_0gtwneATpK8jNgjJ4zx45Ngbc7VXM_5JcV3h0URuZQ3I0ovCWwngm3f744GUV_TsVYn5QLzN";

interface CargoPhotoCardProps {
  photoUri?: string;
  filename?: string;
  size?: string;
  isDesktop: boolean;
}

export const CargoPhotoCard: React.FC<CargoPhotoCardProps> = ({
  photoUri = DEFAULT_CARGO_IMAGE,
  filename = "TN01AB1234_dispatch_rear.jpg",
  size = "2.1 MB",
  isDesktop,
}) => {
  const [retakeCount, setRetakeCount] = useState(0);

  const handleRetake = () => {
    setRetakeCount((prev) => prev + 1);
  };

  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Header */}
        <View style={styles.desktopHeader}>
          <Text
            variant="bodyMd"
            color={COLORS.textPrimary}
            style={{ fontWeight: "500" }}
          >
            Cargo Rear Photo
          </Text>
          <Text
            variant="tabularData"
            color={COLORS.textMuted}
            style={styles.filenameText}
          >
            {filename}
          </Text>
        </View>

        {/* Image Display */}
        <View style={styles.imageFrame}>
          <Image
            source={{ uri: photoUri }}
            style={styles.desktopImage}
            resizeMode="cover"
          />
        </View>

        {/* Footer */}
        <View style={styles.desktopFooter}>
          <View style={styles.verifiedRow}>
            <MaterialIcons
              name="check-circle"
              size={14}
              color={COLORS.statusPaidText}
            />
            <Text variant="bodySm" color={COLORS.textSecondary}>
              Seals attached {retakeCount > 0 && `(Retake #${retakeCount})`}
            </Text>
          </View>
          <Pressable
            onPress={handleRetake}
            style={({ pressed }: any) => [
              styles.retakeBtn,
              pressed && styles.pressed,
            ]}
          >
            <Text
              variant="bodySm"
              color={COLORS.textPrimary}
              style={styles.retakeText}
            >
              Retake
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Mobile Version
  return (
    <View style={styles.mobileContainer}>
      <View style={styles.mobileContent}>
        <View style={styles.mobileThumbWrapper}>
          <Image
            source={{ uri: photoUri }}
            style={styles.mobileThumb}
            resizeMode="cover"
          />
        </View>
        <View style={styles.mobileDetails}>
          <Text
            variant="bodyMd"
            color={COLORS.textPrimary}
            style={styles.mobileFilename}
          >
            {filename}
          </Text>
          <Text variant="bodySm" color={COLORS.textMuted}>
            Rear seal captured • {size} {retakeCount > 0 && `• Retaken`}
          </Text>
        </View>
      </View>

      <MaterialIcons
        name="check-circle"
        size={18}
        color={COLORS.statusPaidText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceSm + 2,
    backgroundColor: COLORS.surfaceSecondary,
    gap: SPACING.spaceSm,
  },
  desktopHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filenameText: {
    fontSize: 11,
  },
  imageFrame: {
    height: 112,
    borderRadius: RADIUS.xs,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#F1F5F9",
  },
  desktopImage: {
    width: "100%",
    height: "100%",
  },
  desktopFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  retakeBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  retakeText: {
    fontSize: 11,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.7,
  },
  // Mobile
  mobileContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    padding: SPACING.spaceSm + 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mobileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm + 2,
    flex: 1,
    minWidth: 0,
    paddingRight: SPACING.spaceSm,
  },
  mobileThumbWrapper: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: "hidden",
    backgroundColor: "#F8FAFC",
  },
  mobileThumb: {
    width: "100%",
    height: "100%",
  },
  mobileDetails: {
    flex: 1,
    minWidth: 0,
  },
  mobileFilename: {
    fontWeight: "500",
    fontSize: 12,
  },
});
