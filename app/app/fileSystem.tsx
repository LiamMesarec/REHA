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
import api from "./api_helper";


type FileListRouteProp = RouteProp<RootStackParamList, 'Files'>;

interface FileListProps {
  route: FileListRouteProp;
}

let defaultMap = {
  name: "files",
  type: 0,
  filePath : "files",
  date : ""
}


const FileSystem: React.FC<FileListProps> = ({ route }) => {
  const [files, setFiles] = useState<FileNode[]>([]); //TO SPREMENI V VOZLIŠČA NASLEDNJIČ! NVM KAJ SM SE ŠPILO TO NEUMNOSTI
  const [folders, setFolders] = useState<FileNode[]>([]);
  const [searchBarText, setSearchBarText] = useState<string> ('');


  //const [selectedMap, setSelectedMap] = useState<string | null>(null);

  const [currentMap, setCurrentMap] = useState<FileNode> (defaultMap);
  const fileSystemRef = useRef<Filesystem | null>(null);

  const [modaleFiles, setModalFiles] = useState<FileNode[]>();
  const [modaleFolders, setModalFolders] = useState<FileNode[]>();
  const [modaleVisible, setModaleVisible] = useState<boolean>(false);

  const loadFromSystem = () => {
    console.log(fileSystemRef.current);
    let childArray = fileSystemRef.current?.getChildrenByPath(currentMap?.filePath ?? "files");
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
    console.log("Nareto");
  }

  useEffect(() => {
    fileSystemRef.current = new Filesystem(); // Only set it once
    fileSystemRef.current?.addPath("files/Mapa1/podatkiBolniki.pdf", 999, "testuuid");
    const fetchFiles = async () => {
      try {
        const response = await api.get("/files");
        console.log("DATOTEKE IZ SERVERJA: ", response.data.files);
        for (let file of response.data.files) {

          let pathBuff = file.path.slice(1); //tu porihtaj pol kr zgublamo procesor za brezveze slice je menda O(n)

          fileSystemRef.current?.addPath(pathBuff,file.id ,file.uuid, file.date_uploaded); // Populate the filesystem
          loadFromSystem();
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
    
  }, []);

  const goToParent = () => {
    let currentNode = fileSystemRef.current?.findNodeByPath(currentMap?.filePath ?? "files");

    if (!currentNode) {
        console.log("Node not found!");
        return;
    }

    if (currentNode.parent) {
      setCurrentMap({ 
        name: currentNode.parent.model.name, 
        type: -1,
        filePath: currentNode.parent.model.filePath,
        date : currentNode.parent.model.date,
        id: currentNode.parent.model.id,
        uuid : currentNode.parent.model.uuid
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
            filePath : i.model.filePath,
            date : i.model.date,
            id : i.model.id,
            uuid : i.model.uuid,
          }
        );
      }else if(i.model.type == 1) {
        modalFilesBuffer.push(
          {
            name:  i.model.name,
            type: i.model.type,
            filePath : i.model.filePath,
            date : i.model.date,
            id: i.model.id,
            uuid : i.model.uuid,
          }
        );
      }
    }

    setModalFiles(modalFilesBuffer);
    setModalFolders(modalFoldersBuffer);
    showFoundFiles();

  }

  const showFoundFiles = () =>{
      setModaleVisible(true);
  }

  const hideFoundFiles = () => {
    setModaleVisible(false);
  }


  useEffect(() => {
    loadFromSystem();

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

      {currentMap?.name !== 'files' && (
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


  <FileUploadScreen refresh={loadFromSystem}/>
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

export default FileSystem;