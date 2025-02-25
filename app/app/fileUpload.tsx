import React, { useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const FileUploadScreen: React.FC = () => {
  const [file, setFile] = useState<any>(null);

  const uploadToServer = async (file: any) => { //simulacija
    console.log('Simulating file upload...');
    setTimeout(() => {
      Alert.alert('Upload Successful', `File ${file.name} uploaded successfully!`);
    }, 2000);
  };

  // Function to select a file
  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // You can specify different file types
      });

      // Store the file data
      setFile(res[0]);

      // Simulate file upload to an API
      uploadToServer(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error(err);
      }
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
        </View>
      )}
    </View>
  );
};

export default FileUploadScreen;