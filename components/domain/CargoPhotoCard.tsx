/**
 * Gripwell - Domain Component: CargoPhotoCard
 * Verification & Handover image capture component.
 * Minimal UI with [ Take Photo ] and [ Choose Photo ] options, preview, replace & remove.
 */

import React from "react";
import { StyleSheet, View } from "react-native";
import { ImageAsset, ImageCaptureField } from "../forms/ImageCaptureField";

export interface CargoPhotoCardProps {
  isDesktop?: boolean;
  onPhotoCaptured?: (asset: ImageAsset | null) => void;
  filename?: string;
  size?: string;
}

export const CargoPhotoCard: React.FC<CargoPhotoCardProps> = ({
  isDesktop = false,
  onPhotoCaptured,
}) => {
  return (
    <View style={styles.container}>
      <ImageCaptureField
        label="VERIFICATION & HANDOVER"
        supportingText="Cargo seal & vehicle rear load proof"
        mode="camera_and_gallery"
        onImageChange={onPhotoCaptured}
        compact={!isDesktop}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
