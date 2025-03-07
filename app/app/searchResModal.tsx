import React, { useState } from "react";
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
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
        <ScrollView style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={onClose}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <MapList folders={folders} onFolderPress={onFolderPress} />
                        <FileList files={files} />
                        <Text>TEST</Text>
                        <Text>TEST2</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Text style={styles.backButtonText}>BACK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default SearchResoults;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-start",
        padding: 20,
    },
    modalContent: {
        flex: 1,
        flexDirection: "column",
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "flex-start",
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
