import React, { useState, useEffect, useRef, useMemo } from "react";
import { Text, TouchableOpacity, View, Alert, StyleSheet, ScrollView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteProp } from '@react-navigation/native';
import { FilesystemElement, RootStackParamList, FileNode } from './types';
import MapList from './mapList';
import { Filesystem } from "./filesystemParser";
import FileUploadScreen from "./fileUpload";
import SearchResoults from "./searchResModal";
import FileList from "./fileList";


type FileListRouteProp = RouteProp<RootStackParamList, 'Files'>;

interface FileListProps {
  route: FileListRouteProp;
}



const FileDisplay: React.FC<FileListProps> = ({ route }) => {
  const [files, setFiles] = useState<FileNode[]>([]); //TO SPREMENI V VOZLIŠČA NASLEDNJIČ! NVM KAJ SI SE ŠPILO TO NEUMNOSTI
  const [folders, setFolders] = useState<FileNode[]>([]);
  const [searchBarText, setSearchBarText] = useState<string> ('');


  //const [selectedMap, setSelectedMap] = useState<string | null>(null);

  const [currentMap, setCurrentMap] = useState<FileNode | null> (null);
  const fileSystemRef = useRef<Filesystem | null>(null);

  const [modaleFiles, setModalFiles] = useState<FileNode[]>();
  const [modaleFolders, setModalFolders] = useState<FileNode[]>();
  const [modaleVisible, setModaleVisible] = useState<boolean>(false);

  fileSystemRef.current = useMemo(() => {
    const fs = new Filesystem();
    fs.addPath("Root\\Mapa1\\podatkiBolniki.pdf");
    fs.addPath("Root\\Mapa1\\PodatkiBolnice.pdf");
    fs.addPath("Root\\Mapa1\\Test\\nekaj.pdf");
    fs.addPath("Root\\Mapa1\\Mapa11\\hrana.pdf");
    fs.addPath("Root\\Mapa1\\Mapa11\\Mapa12\\sladkarije.pdf");
    fs.addPath("Root\\Mapa1\\Mapa112\\upokojenci.pdf");
    fs.addPath("Root\\Mapa1\\Mapa2\\Mapa11\\zdravstveniDom.pdf");
    fs.addPath("Root\\Mapa2\\Mapa21\\testnaDatoteka.pdf");
    fs.addPath("Root\\Mapa2\\ankete.pdf");
    fs.addPath("Root\\Mapa3\\test.pdf");
    return fs;
  }, []);

  const goToParent = () => {
    let currentNode = fileSystemRef.current?.findNodeByPath(currentMap?.filePath ?? "Root");

    if (!currentNode) {
        console.log("Node not found!");
        return;
    }

    if (currentNode.parent) {
      setCurrentMap({ 
        name: currentNode.parent.model.name, 
        type: -1,
        filePath: currentNode.parent.model.filePath 
    });
      console.log("NEW MAP: ", currentNode.parent.model.name);
    } else {
        console.log("Already at root.");
      }
}

  const findFile = (fileName : string) => {
    let matches = fileSystemRef.current?.findNodesByName(fileName);
    let modalFilesBuffer: FileNode[] = [];
    let modalFoldersBuffer: FileNode[] = [];

    for (let i of matches){
      if(i.model.type == 0){
        modalFoldersBuffer.push(
          {
            name:  i.model.name,
            type: i.model.type,
            filePath : i.model.filePath
          }
        );
      }else if(i.model.type == 1) {
        modalFilesBuffer.push(
          {
            name:  i.model.name,
            type: i.model.type,
            filePath : i.model.filePath
          }
        );
      }
    }

    setModalFiles(modalFilesBuffer);
    setModalFolders(modalFoldersBuffer);
    console.log("MODAL FILES: ", modalFilesBuffer);
    console.log("MODAL FOLDERS: ", modalFoldersBuffer);
    console.log("MATCHES: ", matches);
    showFoundFiles();

  }

  const showFoundFiles = () =>{
      setModaleVisible(true);
  }

  const hideFoundFiles = () => {
    setModaleVisible(false);
  }


  useEffect(() => {
    console.log(fileSystemRef.current);
    let childArray = fileSystemRef.current?.getChildrenByPath(currentMap?.filePath ?? "Root");
    //console.log("CHILD ARR:  ", childArray);
    let newFolders: FileNode[] = [];
    let newFiles: FileNode[] = [];
  
    for (let i of childArray) {
      if (i.type === 0) {
        newFolders.push(i)
      } else if (i.type === 1) {
        newFiles.push(i);
      }
    }
    
    setFolders(newFolders)
    setFiles(newFiles);
  }, [currentMap]);

  const loadFile = (index: number): void => {
    Alert.alert('Loading: ', files[index].name);
  };

  const handleFolderPress = (folder: FileNode) => {
    setCurrentMap(folder);
    setModaleVisible(false);
  };

  return (
    <ScrollView style={styles.container}>

      {currentMap?.name !== 'Root' && (
              <TouchableOpacity onPress= {() => goToParent()}>
              <Icon name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
      )}
    <Text style={styles.text}>
        {currentMap ? `${currentMap.filePath}:` : 'Shranjene datoteke:'}
    </Text>

    <View style = {styles.searchContainer}>
        <TextInput
        style = {styles.searchBar}
        placeholder="Išči datoteko"
        value = {searchBarText}
        onChangeText={setSearchBarText}
        />
        <TouchableOpacity onPress={() =>findFile(searchBarText)}> 
        <Icon name="magnify" size={24} color="black" />
        </TouchableOpacity>
      </View>


    <SearchResoults 
      files={modaleFiles || [] } 
      folders={modaleFolders || []}
      modalVisible={modaleVisible} 
      onClose={hideFoundFiles}
      onFolderPress={handleFolderPress}
    />
    <MapList folders={folders} onFolderPress={handleFolderPress}/>
    <FileList files = {files}/>


  <FileUploadScreen/>
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
  searchContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row", 
    justifyContent: "center",
    alignItems: "center",
  },
  fileButton: {
    backgroundColor: "#ffff00",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
    alignItems: "flex-start",
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
  searchBar: {
    height: 40,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
  }
});

export default FileDisplay;