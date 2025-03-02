import React, { useState } from "react";
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { FileNode } from './types';
import FileList from "./fileList";
import MapList from "./mapList";

interface Props {
    files : FileNode[];
    folders : FileNode[];
    modalVisible : boolean;
    onClose: () => void;
    onFolderPress: (folder: FileNode) => void;

}

const SearchResoults :React.FC<Props> = ({files, folders, modalVisible, onClose, onFolderPress}) => {


    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={onClose}
                style={styles.modalContent}
            >
                <View style={styles.modalBackground}>
                    <MapList folders={folders} onFolderPress={onFolderPress} />
                    <FileList files={files} />
                    
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Text style={styles.backButtonText}>BACK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default SearchResoults;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 20,
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    text: {
        marginBottom: 20,
        fontSize: 18,
    },
    backButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        padding: 10,
        backgroundColor: "lightblue",
        borderRadius: 5,
    },
    backButtonText: {
        fontSize: 16,
        color: "black",
    }
});
