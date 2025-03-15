import axios from "axios";
import * as FileSystem from 'expo-file-system';

const api = axios.create({
    baseURL: "http://164.8.31.21:3000/api",
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
  
      const UPLOAD_URL = "http://164.8.31.21:3000/api/files";
  
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



  export const submitEvent = async (title: string, description: string, coordinator: string, date: string) => {
    try {
        const response = await api.post("/events", {
            title: title,
            coordinator: coordinator,
            description: description,
            start: date
        });

        return response.data;
    } catch (error) {
        console.error("Error submitting Event creation data:", error);
        throw error;
    }
};
export default api;