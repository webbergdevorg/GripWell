/**
 * Gripwell - Form: FileUploadDropzone
 * Dashed file dropzone / payment slip upload tile from Stitch.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/spacing";
import { Text } from "../ui/Text";

export interface FileUploadDropzoneProps {
  onFileSelect?: (fileName: string) => void;
  isMobile?: boolean;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileSelect,
  isMobile = false,
}) => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleSimulateUpload = () => {
    const mockFile = "bank_slip_adv1_neft.jpg";
    setUploadedFile(mockFile);
    onFileSelect?.(mockFile);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          variant="labelSm"
          color={COLORS.textSecondary}
          style={styles.headerTitle}
        >
          PAYMENT SCREENSHOT
        </Text>
        <Text
          variant="bodySm"
          color={COLORS.textMuted}
          style={styles.optionalBadge}
        >
          Optional
        </Text>
      </View>

      <Pressable
        onPress={handleSimulateUpload}
        style={({ pressed, hovered }: any) => [
          styles.dropzone,
          hovered && styles.dropzoneHover,
          pressed && styles.dropzonePressed,
        ]}
      >
        <View style={styles.left}>
          <View style={styles.iconBox}>
            <MaterialIcons
              name={uploadedFile ? "check-circle" : "receipt-long"}
              size={18}
              color={
                uploadedFile ? COLORS.statusPaidFill : COLORS.textSecondary
              }
            />
          </View>
          <View style={styles.info}>
            <Text variant="bodyMd" style={styles.title}>
              {uploadedFile
                ? `Attached: ${uploadedFile}`
                : "Upload transaction screenshot or bank slip"}
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={styles.subtitle}
            >
              PNG, JPG, PDF up to 10MB
            </Text>
          </View>
        </View>

        <View style={styles.browseBtn}>
          <MaterialIcons
            name="attach-file"
            size={14}
            color={COLORS.textSecondary}
          />
          <Text
            variant="labelSm"
            color={COLORS.textPrimary}
            style={styles.browseText}
          >
            {uploadedFile ? "Change" : "Browse"}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  optionalBadge: {
    fontSize: 11,
  },
  dropzone: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: RADIUS.sm,
    padding: SPACING.spaceMd,
    ...Platform.select({
      web: {
        cursor: "pointer",
        transitionProperty: "background-color, border-color",
        transitionDuration: "150ms",
      },
    }),
  },
  dropzoneHover: {
    backgroundColor: "#FFFFFF",
    borderColor: "#94A3B8",
  },
  dropzonePressed: {
    opacity: 0.9,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm + 2,
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.xs,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  browseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 28,
    paddingHorizontal: SPACING.spaceSm + 2,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
  },
  browseText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
