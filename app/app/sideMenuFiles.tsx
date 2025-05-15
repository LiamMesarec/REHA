import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as DocumentPicker from 'expo-document-picker';
import { uploadFile, uploadFileEvent } from "./api_helper";

interface MenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  refresh: () => void;
  currentPath: string;
  setNewFolderVisible: (val: boolean) => void;
}

const SideMenu: React.FC<MenuProps> = ({
  menuOpen,
  toggleMenu,
  refresh,
  currentPath,
  setNewFolderVisible,
}) => {
  const slideAnim = useRef(new Animated.Value(menuOpen ? 0 : 250)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? 0 : 250,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  const event1 = () => {
    toggleMenu();
    setNewFolderVisible(true);
  };

  const selectAndUpload = async () => {
    // 1) pick
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.type !== "success") return;  // user cancelled

    // 2) upload
    try {
      const { name, uri } = result;
      let uploadResult;
      // if you ever need to pass an `event` string, use uploadFileEvent(...)
      uploadResult = await uploadFile(
        { uri, name },
        name,
        `${currentPath}/${name}`
      );
      if (Platform.OS === "web") {
        alert(`Uploaded ${name}!`, JSON.stringify(uploadResult));
      } else {
        Alert.alert("Upload Successful", `File ${name} uploaded!`);
      }
      refresh();
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Upload Failed", `${err}`);
    }
  };

  return (
    <Animated.View
    style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
    >
    <Text style={styles.menuText}>MENU</Text>

    {/* Single pressable for both icon + "Naloži" */}
    <TouchableOpacity
    style={styles.menuItem}
    onPress={() => {
      toggleMenu();
      selectAndUpload();
    }}
    >
    <Icon name="upload" size={24} color="black" />
    <Text style={styles.uploadText}>Naloži</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.menuItem} onPress={event1}>
    <Icon name="file-document" size={24} color="black" />
    <Text style={styles.menuText}>Nova Mapa</Text>
    </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sideMenu: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "white",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "black",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 12,
  },
  uploadText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default SideMenu;
