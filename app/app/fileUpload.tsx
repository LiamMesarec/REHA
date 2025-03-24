import React, { useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Naloži datoteko" onPress={selectFile} />

    </View>
  );
};

export default FileUploadScreen;