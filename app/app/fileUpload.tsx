import React, { useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {uploadFile } from "./api_helper";



const uploadToServer = async (file: any) => {
  if (file) {
    try {
      const result = await uploadFile(file, file.name, `files/${file.name}`);
      console.log("Upload result:", result);
      Alert.alert('Upload Successful', `File ${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert('Upload Failed', 'There was an error uploading the file.');
    }
  }
};


const FileUploadScreen: React.FC = () => {
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
      let tmp = uploadToServer(selectedFile);
      console.log("SERVER RESPONSE: ", tmp);
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Select File" onPress={selectFile} />

      {file && (
        <View style={{ marginTop: 20 }}>
          <Text>Selected File:</Text>
          <Text>Name: {file.name}</Text>
        </View>
      )}
    </View>
  );
};

export default FileUploadScreen;