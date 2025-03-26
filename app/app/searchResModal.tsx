import React, { useState } from "react";
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FileNode } from './types';
import FileList from "./fileList";
import MapList from "./mapList";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {deleteFileById} from "./api_helper";
import { Filesystem} from "./filesystemParser";
interface Props {
    files : FileNode[];
    folders : FileNode[];
    modalVisible : boolean;
    onClose: () => void;
    onFolderPress: (folder: FileNode) => void;
    refresh: () => void;
    fileSystemRef: React.RefObject<Filesystem | null>;

}

const SearchResoults :React.FC<Props> = ({files, folders, modalVisible, onClose, onFolderPress, refresh, fileSystemRef }) => {
    const [filesToDelete, setFilesToDelete] = useState<number[]>([]); //tu se hranijo id-ji datotek ki jih brišemo
    const [foldersToDelete, setFoldersToDelete] = useState<string[]>([]); //tu se hranijo pathi do folderjev ki jih brišemo
    const [editVisible, setEditVisible] = useState<boolean>(false);

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
    };

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
        refresh();  
        toggleVisibility();
      }
    const toggleVisibility = () =>{
        setEditVisible(!editVisible);
    }

    return (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={onClose}>
            <View style={styles.modalBackground}>

                <ScrollView contentContainerStyle={styles.scrollViewContent}>

                    <View style={styles.modalContent}>
                        <View style={styles.rowContainer}>

                            {editVisible && <TouchableOpacity style={styles.editButton} onPress={deleteSelected}>
                                <Icon name="delete" size={24} color="gray" />
                            </TouchableOpacity>}

                            {!editVisible && <TouchableOpacity style={styles.editButton} onPress={toggleVisibility}>
                                <Icon name="pencil" size={24} color="black" />
                            </TouchableOpacity>}

                            <Text style={styles.text}>NAJDENE DATOTEKE:</Text>

                            <TouchableOpacity style={styles.backButton} onPress={onClose}>
                                <Icon name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        <MapList 
                            folders={folders} 
                            onFolderPress={onFolderPress} 
                            selectedFolders={foldersToDelete}
                            toggleSelectedFolder={toggleSelectFolder}
                            editVisible={editVisible}
                        />
                        <FileList 
                            files={files}
                            toggleSelectFile={toggleSelectFile}
                            selectedFiles={filesToDelete}
                            editVisible={editVisible}
                        />
                        
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default SearchResoults;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center", 
        alignItems: "center",
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        maxHeight: "90%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        paddingRight: "10 %",
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    backButton: {
        marginLeft: 10,
        padding: 5,
        backgroundColor: "lightcoral",
        borderRadius: 5,
        marginTop: "-10%",
        marginRight: "-11.5 %"
    },
    editButton: {
        padding: 5,
        backgroundColor: "lightblue",
        borderRadius: 5,
        marginTop: "-10%",
        marginLeft: "-5%"
    },
    backButtonText: {
        fontSize: 16,
        color: "black",
    },
    rowContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 0, // Adds spacing
    }
});