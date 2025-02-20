import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, Alert, StyleSheet, ScrollView  } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";



const fileNames: string[] = [
    "Document1.pdf",
    "Image1.png",
    "Spreadsheet1.xlsx",
    "Presentation.pptx",
    "Archive.zip",
    "Script.ts",
    "Style.css",
    "Index.html",
    "App.js",
    "Database.db",
    "Music.mp3",
    "Video.mp4",
    "Notes.txt",
    "Config.json",
    "Backup.tar.gz"
  ];

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".pdf")) {
      return { name: "file-pdf-box", color: "red" };
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


const FileList: React.FC = () => {
    const [files, setFiles] = useState<string[]>([]);

    const loadFile = (index : number) : void => {
        Alert.alert('Loading: ', files[index]);
    }
    useEffect(() => {
        setFiles(fileNames);
      }, []);

  return (
    <ScrollView style={styles.container}>
    <Text style = {styles.text}>Datoteke:</Text>
      {files.map((file, index) => {
        const { name, color } = getFileIcon(file);
        return (
          <TouchableOpacity key={index} onPress={() => loadFile(index)} style={styles.fileButton}>
            <View style={styles.fileRow}>
              <Icon name={name} size={24} color={color} />
              <Text style={styles.text}>{file}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
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
    fileRow: {
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
export default FileList;
