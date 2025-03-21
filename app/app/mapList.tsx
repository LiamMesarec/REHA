// mapDisplay.tsx (Modified to accept props)
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FileNode } from './types';

interface MapListProps {
  folders: FileNode[];
  onFolderPress: (folder: FileNode) => void;
}

const MapList: React.FC<MapListProps> = ({ folders, onFolderPress }) => {
  return (
    <View style={styles.container}>
      {folders.map((folder, index) => (
        <TouchableOpacity
          key={index}
          style={styles.fileButton}
          onPress={() => onFolderPress(folder)}
        >
          <View style={styles.rowContainer}>
            <Icon name="folder" size={24} color="#F1C27D" />
            <Text style={styles.text}>{folder.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 0,
  },
  fileButton: {
    backgroundColor: "#ffff00",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
    alignItems: "flex-start", 
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
    textAlignVertical: "center",
  },
});

export default MapList;