import axios from "axios";
import { Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import alert from "./alert";

const ip = "164.8.162.184";
const api = axios.create({
    baseURL: `http://${ip}:3000/api`,
    timeout: 10000, 
    headers: { 
      "Content-Type": "application/json",
    },
  });

  export const fetchData = async (path: string): Promise<any> => {
    try {
      const response = await api.get(path);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };


  export const uploadFile = async (fileInput: any, filename: string, path: string) => {
    try {
      const file = {
        uri: fileInput.uri,
        name: filename,
        type: fileInput.mimeType
      };
  
      const formData = new FormData();
      formData.append('name', filename);
      formData.append('path', path)
      formData.append('file', {
        uri: file.uri, 
        name: file.name, 
        type: file.type
      } as any); 
  
      const UPLOAD_URL = `http://${ip}:3000/api/files`;
  
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      const result = await response.json();
      console.log("Upload success:", result);
      
      return result;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  export const submitEvent = async (title: string, description: string, coordinator: string, date: string, from:string | null, to: string | null) => {
    if (!title || !description || !coordinator || !date) {
      throw 1;
    }
    try {
      let response;
      if (!from || !to){
        response = await api.post("/events", {
          title: title,
          coordinator: coordinator,
          description: description,
          start: date
      });
      }else{
        response = await api.post("/events", {
            title: title,
            coordinator: coordinator,
            description: description,
            start: date,
            from_date: from,
            to_date: to
        });
      }
        return response.data;
    } catch (error) {
        console.error("Error submitting Event creation data:", error);
        alert("Napaka pri posiljanju podatkov za ustvarjanje dogodka", "Opozorilo");
        throw error;
    }
};

export const fetchAndOpenFile = async (uuid: string, fileName: string) => {
  try {
    const fileExtension = fileName.split('.').pop() || 'pdf'; 
    const fileUri = `${FileSystem.documentDirectory}${fileName}.${fileExtension}`;

    // Download file
    const downloadResumable = FileSystem.createDownloadResumable(
      `http://${ip}:3000/api/files/${uuid}/content`,
      fileUri
    );

    const { uri } = await downloadResumable.downloadAsync();

    if (uri) {
      console.log('File downloaded to:', uri);
      
      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        //window.open(uri, '_blank');
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Error', 'File sharing is not available on this device.');
      }
    }
  } catch (error) {
    console.error('Error downloading or opening file:', error);
    Alert.alert('Error', 'Failed to open file.');
  }
};


export default {fetchData, submitEvent};