/**
 * Gripwell - Form: FileUploadDropzone
 * Real Payment Screenshot & Deposit Slip image picker.
 * Supports image selection from device gallery, file dialog, preview, replace & remove.
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { ImageAsset, ImageCaptureField } from "./ImageCaptureField";

export interface FileUploadDropzoneProps {
  onFileSelect?: (fileName: string) => void;
  isMobile?: boolean;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileSelect,
  isMobile = false,
}) => {
  const handleImageChange = (asset: ImageAsset | null) => {
    if (asset && asset.name) {
      onFileSelect?.(asset.name);
    } else {
      onFileSelect?.("");
    }
  };

  return (
    <View style={styles.container}>
      <ImageCaptureField
        label="PAYMENT SCREENSHOT"
        supportingText="Optional • JPG, PNG, WEBP"
        mode="gallery_only"
        onImageChange={handleImageChange}
        compact={isMobile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
