import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { cloudinaryService } from "../../services/cloudinary.service";

export default function InventoryImagePicker({ onImageUploaded, initialImage }) {
  const [imageUri, setImageUri] = useState(initialImage);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Needed", "Please grant camera roll permissions.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleUpload(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Needed", "Please grant camera permissions.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleUpload(result.assets[0].uri);
    }
  };

  const handleUpload = async (uri) => {
    setUploading(true);
    try {
      const secureUrl = await cloudinaryService.uploadImage(uri);
      setImageUri(secureUrl);
      onImageUploaded(secureUrl);
    } catch (error) {
      Alert.alert("Upload Failed", "Could not upload image to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setImageUri(null);
    onImageUploaded(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ITEM IMAGE (OPTIONAL)</Text>
      
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.removeBtn} onPress={clearImage}>
            <Ionicons name="close-circle" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.pickerBtn, uploading && styles.disabled]} 
            onPress={pickImage}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color={colors.PRIMARY} />
            ) : (
              <>
                <Ionicons name="images-outline" size={24} color={colors.PRIMARY} />
                <Text style={styles.btnText}>Gallery</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.pickerBtn, uploading && styles.disabled]} 
            onPress={takePhoto}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color={colors.PRIMARY} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={24} color={colors.PRIMARY} />
                <Text style={styles.btnText}>Camera</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.SECONDARY,
    marginBottom: 10,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.LIGHT,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
  },
  pickerBtn: {
    flex: 1,
    height: 80,
    backgroundColor: colors.LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  btnText: {
    fontSize: 12,
    color: colors.SECONDARY,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  }
});
