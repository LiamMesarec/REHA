import React, { useState } from 'react';
import { View, Button, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {uploadFile, uploadFileEvent } from "./api_helper";
import alert from './alert';
  import { Platform } from 'react-native';

const uploadToServer = async (file: any, path : string, event: string | null) => {
  if (file) {
    try {
      let result;
      console.log("file: ", file, " path: ", path, " event: ",event);
      if (event != null){
        result = await uploadFileEvent(file, file.name, `${path}/${file.name}`, event);
      }else
      result = await uploadFile(file, file.name, `${path}/${file.name}`);
      console.log("Upload result:", result);
      alert('Upload Successful', `File ${file.name} uploaded successfully! ${result}`);
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
  if (Platform.OS === 'web') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*'; 
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) {
        console.log('No file selected');
        return;
      }

      const selectedFile = {
        uri: '', // Not used in web fetch, optional
        name: file.name,
        size: file.size,
        type: file.type,
        file, // native File object
      };

      // Pass actual `file` instead of blob URI
      const tmp = await uploadToServer(selectedFile, currentPath, null);
      refresh();
      console.log('SERVER RESPONSE:', tmp);
    };
    input.click();
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