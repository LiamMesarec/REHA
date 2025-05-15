import React from "react";
import { TouchableOpacity, Text, Alert, StyleSheet, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { uploadFile, uploadFileEvent } from "./api_helper";

interface UploadProps {
  refresh: () => void;
  currentPath: string;
  event: string | null;
}

const FileUploadScreen: React.FC<UploadProps> = ({ refresh, currentPath, event }) => {
  const selectFile = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "*/*";
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        const selectedFile = { uri: "", name: file.name, size: file.size, type: file.type, file };
        try {
          if (event) {
            await uploadFileEvent(
              selectedFile,
              selectedFile.name,
              `${currentPath}/${selectedFile.name}`,
              event
            );
          } else {
            await uploadFile(
              selectedFile,
              selectedFile.name,
              `${currentPath}/${selectedFile.name}`
            );
          }
          refresh();
          Alert.alert("Upload Successful", `File ${selectedFile.name} uploaded successfully!`);
        } catch (error) {
          console.error("Upload failed:", error);
          Alert.alert("Upload Failed", `Could not upload ${selectedFile.name}.`);
        }
      };
      input.click();
    }
  };

  return (
    <TouchableOpacity style={styles.uploadContainer} onPress={selectFile}>
    <Icon name="upload" size={24} color="black" />
    <Text style={styles.uploadText}>Naloži</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
});

export default FileUploadScreen;
