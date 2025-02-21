// mapDisplay.tsx (Modified to accept props)
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface MapListProps {
  folderNames: string[];  // Receive folder names as props
  onFolderPress: (folderName: string) => void;  // Callback when a folder is clicked
}

const MapList: React.FC<MapListProps> = ({ folderNames, onFolderPress }) => {
  return (
    <ScrollView style={styles.container}>
      {folderNames.map((folder, index) => (
        <TouchableOpacity
          key={index}
          style={styles.fileButton}
          onPress={() => onFolderPress(folder)} // Trigger callback when folder is clicked
        >
          <View style={styles.rowContainer}>
            <Icon name="folder" size={24} color="#F1C27D" />
            <Text style={styles.text}>{folder}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  fileButton: {
    backgroundColor: "#ffff00",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default MapList;