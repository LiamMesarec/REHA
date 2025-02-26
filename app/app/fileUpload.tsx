import React, { useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const FileUploadScreen: React.FC = () => {
  const [file, setFile] = useState<any>(null);

  // Simulated upload function
  const uploadToServer = async (file: any) => {
    console.log('Simulating file upload...');
    setTimeout(() => {
      Alert.alert('Upload Successful', `File ${file.name} uploaded successfully!`);
    }, 2000);
  };

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',  
      });

      if (res.type === 'cancel') {
        console.log('User canceled the picker');
        return;
      }

      setFile(res);
      uploadToServer(res);
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
          <Text>Size: {file.size} bytes</Text>
          <Text>URI: {file.uri}</Text>
        </View>
      )}
    </View>
  );
};

export default FileUploadScreen;