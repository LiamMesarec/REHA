import React, { useState } from 'react';
import { View, Button, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {uploadFile } from "./api_helper";



const uploadToServer = async (file: any, path : string) => {
  if (file) {
    try {
      const result = await uploadFile(file, file.name, `${path}/${file.name}`);
      console.log("Upload result:", result);
      Alert.alert('Upload Successful', `File ${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert('Upload Failed', 'There was an error uploading the file.');
    }
  }
};

interface UploadProps{
  refresh : () => void,
  currentPath : string,
}

const FileUploadScreen: React.FC<UploadProps> = ({refresh, currentPath}) => {
  const [file, setFile] = useState<any>(null);



  const selectFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',  
      });

      if (res.type === 'cancel') {
        console.log('User canceled the picker');
        return;
      }
      console.log('DOCUMENT RESPONSE:', res);

      const selectedFile = res.assets[0];
      setFile(selectedFile);
      let tmp = await uploadToServer(selectedFile, currentPath);
      refresh();
      console.log("SERVER RESPONSE: ", tmp);
    } catch (err) {
      //console.error('Error picking document:', err);
    }
  };

  return (
    <TouchableOpacity onPress={selectFile} style={styles.uploadButtonContainer}>
      <Text style={styles.uploadButtonText}>Naloži</Text>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadButtonContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 10,  
  },
  uploadButtonText: {
    marginRight: 10, 
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
export default FileUploadScreen;