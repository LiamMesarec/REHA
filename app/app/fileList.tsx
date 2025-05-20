
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform} from 'react-native';
import { Checkbox } from 'expo-checkbox';
import React, { useState, useEffect, useRef, useMemo } from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FileNode } from './types';
import {fetchAndOpenFile } from "./api_helper";
import {deleteFileById} from "./api_helper";



const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) {
      return { name: "file-pdf-box", color: "red"};
    } else if (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
      return { name: "file-image", color: "blue" };
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      return { name: "file-excel", color: "green" };
    } else if (fileName.endsWith(".pptx") || fileName.endsWith(".ppt")) {
      return { name: "file-powerpoint", color: "orange" };
    } else if (fileName.endsWith(".zip") || fileName.endsWith(".tar.gz") || fileName.endsWith(".rar")) {
      return { name: "folder-zip", color: "purple" };
    } else if (fileName.endsWith(".mp3") || fileName.endsWith(".wav")) {
      return { name: "music-note", color: "purple" };
    } else if (fileName.endsWith(".mp4") || fileName.endsWith(".avi")) {
      return { name: "video", color: "black" };
    } else if (fileName.endsWith(".txt")) {
      return { name: "file-document", color: "gray" };
    } else if (fileName.endsWith(".json") || fileName.endsWith(".db") || fileName.endsWith(".ts") || fileName.endsWith(".js") || fileName.endsWith(".css") || fileName.endsWith(".html")) {
      return { name: "code-tags", color: "teal" };
    } else {
      return { name: "file", color: "black" };
    }
  };

  interface FileListProps { //mby bomo rabli kaj več
    files: FileNode[];
    toggleSelectFile : (id : number) => void;
    selectedFiles : number[];
    editVisible : boolean;
  }

const FileList: React.FC<FileListProps> = ({ files, toggleSelectFile, selectedFiles, editVisible}) => {


  const loadFile = (index: number): void => {
    //Alert.alert('Loading: ', files[index].uuid.toString());
    fetchAndOpenFile(files[index].uuid, files[index].name);

  };

  const fileButtonMargin = Platform.OS === "web" ? 0 : 15;


  return (
    <View style={styles.container}>
      {files.map((file, index) => {
        const { name, color } = getFileIcon(file.name);
        let fileName = (file.name.length <= 10) ? file.name : file.name;
        if (fileName.endsWith(".folder")) {
          return null; // Skip rendering this file
        }

        return (
          <View key = {file.id} style = {[styles.fileContainer, { marginVertical: fileButtonMargin }]}>
             {editVisible &&<Checkbox
              value={selectedFiles.includes(file.id)}
              onValueChange={() => toggleSelectFile(file.id)}
            />}
            <TouchableOpacity key={index} onPress={() => loadFile(index)} style={styles.fileButton}>
              <View style={styles.fileRow}>
                <Icon name={name} size={40} color={color} />
                <View style= {styles.mapNameContainer}>
                <Text style={styles.text}>{fileName}</Text>
                <Text style={styles.dateText}>{file.date}</Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>

        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor: "#ffffff",
      padding: 5,
      paddingRight: "5%",
    },
    fileButton: {
      backgroundColor: "#ffffff",
      padding: 5,
      marginVertical: 5,
      borderRadius: 5,
      borderColor: "black",
      borderWidth: 1,
      width: "100%",
      alignItems: "flex-start",
      marginLeft : 5,
    },
    fileRow: {
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
      alignItems : "center",
    },
    mapNameContainer : {
      flex: 1,
      flexDirection: "column",
    },

  });

export default FileList;
