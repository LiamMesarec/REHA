// mapDisplay.tsx (Modified to accept props)
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FileNode } from './types';
import { Checkbox } from 'expo-checkbox';

interface MapListProps {
  folders: FileNode[];
  onFolderPress: (folder: FileNode) => void;
  selectedFolders : string[];
  toggleSelectedFolder : (folderName : string) => void;
  editVisible : boolean;
}

const MapList: React.FC<MapListProps> = ({ folders, onFolderPress, selectedFolders, toggleSelectedFolder, editVisible }) => {
  return (
    <View style={styles.container}>
      {folders.map((folder, index) => (
        <View key={folder.filePath} style={styles.fileContainer}>
            {editVisible && <Checkbox
            value={selectedFolders.includes(folder.filePath)}
            onValueChange={() => toggleSelectedFolder(folder.filePath)}
            />}
          <TouchableOpacity
            key={index}
            style={[styles.fileButton, editVisible?{width: "94.8%"}: {width: "100%"}]}
            onPress={() => onFolderPress(folder)}
          >
            <View style={styles.rowContainer}>
              <Icon name="folder" size={40} color="#F1C27D" />
              <View style= {styles.mapNameContainer}>
                <Text style={styles.text}>{folder.name}</Text>
                <Text style={styles.dateText}>{folder.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 5,
    paddingRight: "4%",
  },
  fileButton: {
    backgroundColor: "#ffffff",
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "flex-start", 
    marginLeft : 5,
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
  dateText: {
    color: "black",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 10,
    textAlignVertical: "center",
  }, 
  fileContainer: {
    flex : 1,
    flexDirection : "row",
    alignItems : "center"
  },   
  mapNameContainer : {
    flex: 1,
    flexDirection: "column",
  },
});

export default MapList;