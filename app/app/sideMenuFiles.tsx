import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FileUploadScreen from "./fileUpload";

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

  const handleNewFolder = () => {
    toggleMenu();
    setNewFolderVisible(true);
  };

  return (
    <Animated.View
    style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
    >
    <Text style={styles.menuHeader}>MENU</Text>

    {/* Upload File */}
    <View style={styles.menuItem}>
    <FileUploadScreen
    refresh={refresh}
    currentPath={currentPath}
    event={null}
    />
    </View>

    {/* New Folder */}
    <TouchableOpacity style={styles.menuItem} onPress={handleNewFolder}>
    <Icon name="folder-plus" size={24} color="black" />
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
  menuHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
});

export default SideMenu;
