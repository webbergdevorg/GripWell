/**
 * Gripwell - Form Component: ImageCaptureField
 * Real native camera and gallery image picker for Android, iOS, and Web.
 * Replaces simulated file uploads and static mock photos.
 */

import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { RADIUS } from "../../constants/spacing";
import { Text } from "../ui/Text";

export interface ImageAsset {
  uri: string;
  name?: string;
  size?: number;
  mimeType?: string;
}

export interface ImageCaptureFieldProps {
  label?: string;
  supportingText?: string;
  mode?: "camera_and_gallery" | "gallery_only" | "camera_only";
  currentImageUri?: string | null;
  onImageChange?: (asset: ImageAsset | null) => void;
  maxSizeBytes?: number; // default 10MB
  compact?: boolean;
}

export const ImageCaptureField: React.FC<ImageCaptureFieldProps> = ({
  label,
  supportingText = "JPG, PNG, WEBP up to 10MB",
  mode = "gallery_only",
  currentImageUri = null,
  onImageChange,
  maxSizeBytes = 10 * 1024 * 1024,
  compact = false,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<ImageAsset | null>(
    currentImageUri
      ? { uri: currentImageUri, name: "attached_image.jpg" }
      : null,
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const notifyChange = (asset: ImageAsset | null) => {
    setSelectedAsset(asset);
    setErrorMessage(null);
    onImageChange?.(asset);
  };

  const handleChoosePhoto = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // On native platforms, request media library permissions
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          const msg =
            "Permission to access device photos was denied. Please enable photo permissions in your device settings.";
          setErrorMessage(msg);
          Alert.alert("Permission Required", msg);
          setLoading(false);
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.85,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setLoading(false);
        return;
      }

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > maxSizeBytes) {
        const msg =
          "Selected file exceeds the 10MB limit. Please choose a smaller image.";
        setErrorMessage(msg);
        setLoading(false);
        return;
      }

      const fileName =
        asset.fileName ||
        `photo_${Date.now()}.${asset.mimeType?.split("/")[1] || "jpg"}`;

      notifyChange({
        uri: asset.uri,
        name: fileName,
        size: asset.fileSize,
        mimeType: asset.mimeType,
      });
    } catch (err: any) {
      setErrorMessage("Failed to select image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          const msg =
            "Permission to access the camera was denied. Please allow camera permissions in settings.";
          setErrorMessage(msg);
          Alert.alert("Camera Permission Required", msg);
          setLoading(false);
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.85,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setLoading(false);
        return;
      }

      const asset = result.assets[0];
      const fileName =
        asset.fileName ||
        `camera_${Date.now()}.${asset.mimeType?.split("/")[1] || "jpg"}`;

      notifyChange({
        uri: asset.uri,
        name: fileName,
        size: asset.fileSize,
        mimeType: asset.mimeType,
      });
    } catch (err: any) {
      // Graceful fallback for browser when camera is unavailable
      if (Platform.OS === "web") {
        handleChoosePhoto();
        return;
      }
      setErrorMessage(
        "Camera could not be accessed. Please choose from photos instead.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    notifyChange(null);
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text
            variant="labelSm"
            color={COLORS.textPrimary}
            style={styles.labelText}
          >
            {label}
          </Text>
          {supportingText && (
            <Text
              variant="bodySm"
              color={COLORS.textMuted}
              style={{ fontSize: 11 }}
            >
              {supportingText}
            </Text>
          )}
        </View>
      )}

      {/* Error Message if any */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <MaterialIcons
            name="error-outline"
            size={14}
            color={COLORS.statusOverdueFill}
          />
          <Text
            variant="bodySm"
            color={COLORS.statusOverdueText}
            style={{ fontSize: 11, flex: 1 }}
          >
            {errorMessage}
          </Text>
        </View>
      )}

      {/* State A: Selected Image Preview */}
      {selectedAsset ? (
        <View
          style={[styles.previewCard, compact && styles.previewCardCompact]}
        >
          <View style={styles.thumbnailWrapper}>
            <Image
              source={{ uri: selectedAsset.uri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </View>

          <View style={styles.previewInfo}>
            <Text
              variant="bodySm"
              color={COLORS.textPrimary}
              style={{ fontWeight: "600" }}
              numberOfLines={1}
            >
              {selectedAsset.name || "Attached Photo"}
            </Text>
            <View style={styles.verifiedTag}>
              <MaterialIcons
                name="check-circle"
                size={12}
                color={COLORS.statusPaidFill}
              />
              <Text
                variant="labelSm"
                color={COLORS.statusPaidText}
                style={{ fontSize: 10 }}
              >
                Image attached
              </Text>
            </View>
          </View>

          <View style={styles.previewActions}>
            <Pressable
              onPress={
                mode === "camera_only" ? handleTakePhoto : handleChoosePhoto
              }
              style={({ pressed }: any) => [
                styles.actionBtn,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Replace photo"
            >
              <MaterialIcons
                name="sync"
                size={13}
                color={COLORS.textSecondary}
              />
              <Text variant="labelSm" color={COLORS.textSecondary}>
                Replace
              </Text>
            </Pressable>

            <Pressable
              onPress={handleRemove}
              style={({ pressed }: any) => [
                styles.actionBtn,
                styles.removeBtn,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <MaterialIcons
                name="close"
                size={13}
                color={COLORS.statusOverdueFill}
              />
              <Text variant="labelSm" color={COLORS.statusOverdueFill}>
                Remove
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        /* State B: Empty Image Selector / Dropzone */
        <View
          style={[
            styles.emptyContainer,
            compact && styles.emptyContainerCompact,
          ]}
        >
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={{ marginTop: 4 }}
              >
                Loading image...
              </Text>
            </View>
          ) : mode === "camera_and_gallery" ? (
            /* Dual Option: Take Photo | Choose Photo */
            <View style={styles.dualButtonRow}>
              <Pressable
                onPress={handleTakePhoto}
                style={({ pressed }: any) => [
                  styles.buttonChoice,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Take Photo with camera"
              >
                <MaterialIcons
                  name="photo-camera"
                  size={16}
                  color={COLORS.primary}
                />
                <Text variant="labelSm" color={COLORS.textPrimary}>
                  Take Photo
                </Text>
              </Pressable>

              <Pressable
                onPress={handleChoosePhoto}
                style={({ pressed }: any) => [
                  styles.buttonChoice,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Choose Photo from gallery"
              >
                <MaterialIcons
                  name="photo-library"
                  size={16}
                  color={COLORS.primary}
                />
                <Text variant="labelSm" color={COLORS.textPrimary}>
                  Choose Photo
                </Text>
              </Pressable>
            </View>
          ) : (
            /* Single Option Dropzone: Choose File */
            <Pressable
              onPress={handleChoosePhoto}
              style={({ pressed, hovered }: any) => [
                styles.singleDropzone,
                hovered && styles.singleDropzoneHover,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Upload file or screenshot"
            >
              <View style={styles.dropzoneIconBox}>
                <MaterialIcons
                  name="cloud-upload"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </View>
              <View style={styles.dropzoneTextBox}>
                <Text
                  variant="bodySm"
                  color={COLORS.textPrimary}
                  style={{ fontWeight: "500" }}
                >
                  Click to select payment screenshot
                </Text>
                <Text
                  variant="bodySm"
                  color={COLORS.textMuted}
                  style={{ fontSize: 11 }}
                >
                  JPG, PNG, WEBP from device
                </Text>
              </View>
              <View style={styles.browsePill}>
                <Text variant="labelSm" color={COLORS.textSecondary}>
                  Browse
                </Text>
              </View>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  labelText: {
    fontSize: 11,
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: COLORS.statusOverdueBg,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.statusOverdueBorder,
    marginBottom: 6,
  },

  // Preview Card
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  previewCardCompact: {
    padding: 6,
  },
  thumbnailWrapper: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.xs,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  previewInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  previewActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  removeBtn: {
    borderColor: COLORS.statusOverdueBorder,
    backgroundColor: COLORS.statusOverdueBg,
  },

  // Empty Containers
  emptyContainer: {
    width: "100%",
  },
  emptyContainerCompact: {},
  loadingBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSecondary,
  },

  // Dual Buttons
  dualButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonChoice: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 36,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xs,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },

  // Single Dropzone
  singleDropzone: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: RADIUS.xs,
    gap: 10,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  singleDropzoneHover: {
    borderColor: COLORS.textSecondary,
    backgroundColor: COLORS.surfaceSecondary,
  },
  dropzoneIconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  dropzoneTextBox: {
    flex: 1,
    minWidth: 0,
  },
  browsePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pressed: {
    opacity: 0.7,
  },
});
