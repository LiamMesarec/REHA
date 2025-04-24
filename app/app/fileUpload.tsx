import React, { useState } from 'react';
import { View, Button, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {uploadFile, uploadFileEvent } from "./api_helper";
import alert from './alert';


const uploadToServer = async (file: any, path : string, event: string | null) => {
  if (file) {
    try {
      let result;
      console.log("file: ", file, " path: ", path, " event: ",event);
      if (event){
        result = await uploadFileEvent(file, file.name, `${path}/${file.name}`, event);
      }else
      result = await uploadFile(file, file.name, `${path}/${file.name}`);
      console.log("Upload result:", result);
      alert('Upload Successful', `File ${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert('Upload Failed', 'There was an error uploading the file.');
    }
  }
};

interface UploadProps{
  refresh : () => void,
  currentPath : string,
  event: string | null
}

const FileUploadScreen: React.FC<UploadProps> = ({refresh, currentPath, event}) => {
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
      let tmp = await uploadToServer(selectedFile, currentPath, event);
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