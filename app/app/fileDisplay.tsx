import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, View, Alert, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import MapList from './mapDisplay';
import { Filesystem } from "./filesystemParser";

type FileListRouteProp = RouteProp<RootStackParamList, 'Files'>;

interface FileListProps {
  route: FileListRouteProp;
}



const folderNames: string[] = [
  "Mapa1",
  "Mapa2",
  "Mapa3",
];

const FileList: React.FC<FileListProps> = ({ route }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const fileSystemRef = useRef<Filesystem | null>(null);

  let mapNameBuffer: string | undefined;
  
  if(route && route.params != undefined){
     mapNameBuffer = route.params.mapNameBuffer;
  }else{
    mapNameBuffer = "";
  }

  useEffect(() => {

    fileSystemRef.current = new Filesystem('Root');

    fileSystemRef.current?.addPath("Mapa1\\datoteka1.pdf");
    fileSystemRef.current?.addPath("Mapa1\\datoteka2.pdf");
    fileSystemRef.current?.addPath("Mapa1\\Mapa11\\datoteka3.pdf");
    fileSystemRef.current?.addPath("Mapa1\\Mapa112\\datoteka4.pdf");
    fileSystemRef.current?.addPath("Mapa2\\datoteka3.pdf");
    fileSystemRef.current?.addPath("Mapa2\\Mapa21\\datoteka5.pdf");
    fileSystemRef.current?.addPath("Mapa3\\Mapa21\\datoteka5.pdf");

  }, []);

  useEffect(() => {
    console.log(fileSystemRef.current);
    let childArray = fileSystemRef.current?.getChildrenByName(selectedMap ?? "root");
    console.log("CHILD ARR:  ", childArray);
    let newFolders: string[] = [];
    let newFiles: string[] = [];
  
    for (let i of childArray) {
      if (i.type === 0) {
        newFolders.push(i.name);
      } else if (i.type === 1) {
        newFiles.push(i.name);
      }
    }
    
    setFolders(newFolders)
    setFiles(newFiles);
  }, [selectedMap]);

  const loadFile = (index: number): void => {
    Alert.alert('Loading: ', files[index]);
  };

  const handleFolderPress = (folderName: string) => {
    setSelectedMap(folderName);

  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>
        {selectedMap ? `${selectedMap} Datoteke:` : 'Select a Map to View Files'}
      </Text>
      
      <MapList folderNames={folders} onFolderPress={handleFolderPress} />

      {selectedMap && files.map((file, index) => {
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