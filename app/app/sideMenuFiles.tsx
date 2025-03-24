import React, { useRef } from "react";
import {View,Text,TouchableOpacity,Animated,StyleSheet,} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FileUploadScreen from "./fileUpload";
interface MenuProps{
    menuOpen : boolean;
    toggleMenu : () => void;
    refresh : () => void;
    currentPath : string;
    setNewFolderVisible : (val : boolean) => void;
}

const SideMenu: React.FC<MenuProps> = ({ menuOpen, toggleMenu , refresh, currentPath, setNewFolderVisible}) => {
    const slideAnim = useRef(new Animated.Value(menuOpen ? 0 : 250)).current;

React.useEffect(() => {
  Animated.timing(slideAnim, {
    toValue: menuOpen ? 250 :500,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, [menuOpen]);

    const event1 = () =>{
        toggleMenu();
        setNewFolderVisible(true);
    }
  return (
    <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
      {/* Close Button */}

      <Text style={styles.menuText}>MENU</Text>

      <TouchableOpacity style={styles.menuItem} onPress={toggleMenu}>
        <Icon name="upload" size={24} color="black" />
        <FileUploadScreen refresh={refresh} currentPath={currentPath} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => event1()}>
      <Icon name="file-document" size={24} color="black" />
        <Text style={styles.menuText}>Nova Mapa</Text>
      </TouchableOpacity>


    </Animated.View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
      },
    sideMenu: {
        position: "absolute",  
        left: 0,
        top: 0,
        bottom: 0,
        width: 250,
        height: 200,
        backgroundColor: "white",
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 1000,
      },
  closeButton: {
    alignSelf: "flex-end",
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
    paddingVertical: 5,     
    marginBottom: 10,  
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});

export default SideMenu;
