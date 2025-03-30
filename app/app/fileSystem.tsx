import React, { useState, useEffect, useRef, useMemo, forwardRef } from "react";
import { Text, TouchableOpacity, View, Alert, StyleSheet, ScrollView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RouteProp } from '@react-navigation/native';
import { FilesystemElement, RootStackParamList, FileNode } from './types';
import MapList from './mapList';
import { Filesystem} from "./filesystemParser";
import FileUploadScreen from "./fileUpload";
import SearchResoults from "./searchResModal";
import FileList from "./fileList";
import api from "./api_helper";
import {deleteFileById} from "./api_helper";
import CreateFolder from "./createFolder";
import SideMenu from "./sideMenuFiles";


type FileListRouteProp = RouteProp<RootStackParamList, 'Files'>;

interface FileListProps {
  route: FileListRouteProp;
}

let defaultMap = {
  name: "Files",
  type: 0,
  filePath : "Files",
  date : ""
}


const FileSystem: React.FC<FileListProps> = ({ route }) => {
  const [files, setFiles] = useState<FileNode[]>([]); //TO SPREMENI V VOZLIŠČA NASLEDNJIČ! NVM KAJ SM SE ŠPILO TO NEUMNOSTI
  const [folders, setFolders] = useState<FileNode[]>([]);
  const [searchBarText, setSearchBarText] = useState<string> ('');

  //const [selectedMap, setSelectedMap] = useState<string | null>(null);

  const [currentMap, setCurrentMap] = useState<FileNode> (defaultMap);
  const fileSystemRef = useRef<Filesystem | null>(null);

  const [modaleFiles, setModalFiles] = useState<FileNode[]>(); // datoteke ki jih prikaže search
  const [modaleFolders, setModalFolders] = useState<FileNode[]>(); // mape ki jih prikaže search
  const [modaleVisible, setModaleVisible] = useState<boolean>(false);

  const [filesToDelete, setFilesToDelete] = useState<number[]>([]); //tu se hranijo id-ji datotek ki jih brišemo
  const [foldersToDelete, setFoldersToDelete] = useState<string[]>([]); //tu se hranijo pathi do folderjev ki jih brišemo
  const [editActive, setEditActive] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newFolderVisible, setNewFolderVisible] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const loadFromSystem = () => { //skrbi za prikaz datotek shranjenih v podatkovni strukturio filesystem
    console.log(fileSystemRef.current);
    let childArray = fileSystemRef.current?.getChildrenByPath(currentMap?.filePath ?? "Files");
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

  const loadFromServer = () =>{ //potegne datoteke iz serverj. Služi lahko kot REFRESH
    fileSystemRef.current = new Filesystem(); 
    fileSystemRef.current?.addPath("Files/Mapa1/podatkiBolniki.pdf", 999, "testuuid", new Date().toString());
    const fetchFiles = async () => {
      try {
        const response = await api.get("/files");
        console.log("DATOTEKE IZ SERVERJA: ", response.data.files);
        for (let file of response.data.files) {

          //let pathBuff = file.path.slice(1); //tu porihtaj pol kr zgublamo procesor za brezveze slice je menda O(n)

          fileSystemRef.current?.addPath(file.path,file.id ,file.uuid, file.date_uploaded);
          loadFromSystem();
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }

  useEffect(() => {
    loadFromServer();
    
  }, []);

  useEffect(() => {
    loadFromSystem();
    
  }, [currentMap]);

  const goToParent = () => {
    let currentNode = fileSystemRef.current?.findNodeByPath(currentMap?.filePath ?? "Files");

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
    console.log("TO IŠČEM: ", fileName);
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




  const loadFile = (index: number): void => {
    Alert.alert('Loading: ', files[index].name);
  };

  const toggleSelectFile = (id: number) => {
    setFilesToDelete(prevFilesToDelete => {
        if (prevFilesToDelete.includes(id)) { //unselct file
          return prevFilesToDelete.filter(fileIndex => fileIndex !== id);
        } else { //select file
          return [...prevFilesToDelete, id];
        }
      });
  };
  const toggleSelectFolder = (name : string) => {
    setFoldersToDelete(prevFoldersToDelete => {
        if(prevFoldersToDelete.includes(name)){
          return prevFoldersToDelete.filter(folderName => folderName !== name);
        }else{
          return [...prevFoldersToDelete, name];
        }
    })
  }

  const deleteSelected = () => {
    for(let id of filesToDelete){
      deleteFileById(id);
    }

    for(let path of foldersToDelete){
      let node = fileSystemRef.current?.findNodeByPath(path);
      let fileNodes = fileSystemRef.current?.findLeafNodes(node);
      console.log("LEEF NODES:   ", fileNodes);
      for(let file of fileNodes){
          if(!file.model.name.endsWith(".folder")){
            deleteFileById(file.model.id);
          }
      }
    }
    setFilesToDelete([]);
    setFoldersToDelete([]);
    loadFromServer();  
    setEditActive(false);
  }

  const handleFolderPress = (folder: FileNode) => {
    setCurrentMap(folder);
    setModaleVisible(false);
  };

  const createFolder = (name : string) =>{
      let path = `${currentMap.filePath}/${name}/placeholder.folder`
      fileSystemRef.current?.addPath(path, 999, "uuid");
      
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
            {/*Nazaj*/}
            {(currentMap.name != "Files") &&
              <TouchableOpacity onPress={() => goToParent()} style={styles.rowContainer}>
                  <Icon name="arrow-left" size={24} color="black" />
                  <Text>Nazaj</Text>
            </TouchableOpacity>}
                
                {/*Trenutna mapa*/}
            <Text style={styles.headerText}>
                {currentMap ? `${currentMap.name}:` : 'Shranjene datoteke:'}
            </Text>
                
                {/*Menu*/}

            <TouchableOpacity onPress={toggleMenu}>
                <Icon name="menu" size={30} color="black" />
            </TouchableOpacity>
            
        </View>

        <View style={styles.searchContainer}>
          {/*ISKALNIK*/}
          <TextInput
            style={styles.searchBar}
            placeholder="Išči datoteko"
            placeholderTextColor="gray"
            value={searchBarText}
            onChangeText={setSearchBarText}
            onSubmitEditing={() => findFile(searchBarText)}
            returnKeyType="search"
          />
          {/*Ikona z povečevalnim steklom*/}
          <TouchableOpacity onPress={() => findFile(searchBarText)}>
            <Icon name="magnify" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
      <SideMenu 
        menuOpen={menuOpen} 
        toggleMenu={toggleMenu} 
        refresh={loadFromServer} 
        currentPath={currentMap.filePath}
        setNewFolderVisible = {setNewFolderVisible}
        />

        <SearchResoults
          files={modaleFiles || []}
          folders={modaleFolders || []}
          modalVisible={modaleVisible}
          onClose={hideFoundFiles}
          onFolderPress={handleFolderPress}
          refresh={loadFromServer}
          fileSystemRef={fileSystemRef}
        />
        <CreateFolder 
          createFolder={createFolder} 
          refresh={loadFromSystem} 
          visible = {newFolderVisible}
          setVisible={setNewFolderVisible}
          />

          <MapList
            folders={folders}
            onFolderPress={handleFolderPress}
            selectedFolders={foldersToDelete}
            toggleSelectedFolder={toggleSelectFolder}
            editVisible = {editActive}
          />
          <FileList
            files={files}
            toggleSelectFile={toggleSelectFile}
            selectedFiles={filesToDelete}
            editVisible = {editActive}
          />
          <View style={styles.nekiForcedPadding}> {/*NEVEM ZAKAJ NE DELA BREZ TEGA! PUSTI NOT ČE NE NUCAŠ */}
          </View>                                 {/*Če tega ni: ne gre uploadat v prazno mapo */}



        
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.headerRow}>

          {!editActive && <TouchableOpacity onPress={() => setEditActive(true)}>
              <Text style={styles.editText}>UREDI</Text>
          </TouchableOpacity>}

          {editActive && <TouchableOpacity onPress={deleteSelected}>
            <Icon name="delete" size={30} color="gray" />
          </TouchableOpacity>}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white', 
    padding: 10,
    flexDirection: "column",
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerRow:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1, 
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editText: {
    fontSize: 20,
  },
  scrollView: {
    marginTop: 100,
    marginBottom : 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    width: "100%",
    position: "relative",
  },
  searchBar: {
    flex: 1,
    paddingLeft: 10,
    height: "100%",
  },
  searchIcon: {
    position: "absolute",
    left: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems : "center"
  }, 
  footer : {
    position : "absolute", 
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  }, 
  nekiForcedPadding: {
    minHeight: 300, 
    flexDirection: "column",
    justifyContent: "flex-end", 
    alignItems: "flex-start",
    paddingTop: 10, 
  }
});


export default FileSystem;