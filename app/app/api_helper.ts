import axios from "axios";
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import alert from "./alert";
import { router } from "expo-router";
import * as storage from './storage';

const ip = "193.2.219.130";
const api = axios.create({
  baseURL: `http://${ip}/api`,
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
    console.error("Error fetching data with path:", path, " ---- Error: ", error);
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
    formData.append('path', path);
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type
    } as any);

    const UPLOAD_URL = `http://${ip}/api/files`;

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    const result = await response.json();
    console.log("Upload success:", result);
    console.log("\n\n\n\n", `Upload: ${result.message}`);
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const uploadFileEvent = async (fileInput: any, filename: string, path: string, eventId: string) => {
  try {
    const response = await uploadFile(fileInput, filename, path);
    const result = addFileToEvent(Number(eventId), response.id);
    router.back();
    return result;
  } catch (error) {
    alert("Napaka pri dogajanju gradiva k dogodku", "Opozorilo");
  }
};

export const submitEvent = async (title: string, description: string, coordinator: string, date: string, from: string | null, to: string | null) => {
  if (!title || !description || !coordinator || !date) {
    throw 1;
  }
  try {
    let response;
    if (!from || !to) {
      response = await api.post("/events", {
        title,
        coordinator,
        description,
        start: date
      });
    } else {
      response = await api.post("/events", {
        title,
        coordinator,
        description,
        start: date,
        from_date: from,
        to_date: to
      });
    }
    return response.data;
  } catch (error) {
    console.error("Error submitting Event creation data: ", error);
    alert("Napaka pri posiljanju podatkov za ustvarjanje dogodka", "Opozorilo");
    throw error;
  }
};

export const submitUpdateEvent = async (id: string, title: string, description: string, coordinator: string, date: string, from: string, to: string) => {
  try {
    const response = await api.put(`/events/${id}`, {
      title,
      coordinator,
      description,
      start: date,
      from_date: from,
      to_date: to
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error when updating event: ", error);
  }
};

export const deleteEventById = async (id: number) => {
  try {
    const response = await api.delete(`/events/${id}`);
    console.log("Event deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export const fetchAndOpenFile = async (uuid: string, fileName: string) => {
  try {
    const fileExtension = fileName.split('.').pop() || 'pdf';
    const fileUri = `${FileSystem.documentDirectory}${fileName}.${fileExtension}`;

    const downloadResumable = FileSystem.createDownloadResumable(
      `http://${ip}/api/files/${uuid}/content`,
      fileUri
    );

    const { uri } = await downloadResumable.downloadAsync();

    if (uri) {
      console.log('File downloaded to:', uri);
      if (await Sharing.isAvailableAsync()) {
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

export const fetchFileUri = async (uuid: string) => {
  const downloadResumable = FileSystem.createDownloadResumable(
    `http://${ip}/api/files/${uuid}/content`,
    `${FileSystem.documentDirectory}${uuid}`
  );

  if (!downloadResumable) throw new Error("Error in filedownload");

  const { uri } = await downloadResumable.downloadAsync();
  if (!uri) {
    throw new Error("Uri not valid");
  }
  return uri;
};

export const addFileToEvent = async (id: number, fileId: number) => {
  try {
    return await api.post(`/events/${id}/files`, { fileId });
  } catch (error) {
    console.log("Response: ______ ", error);
  }
};

export const deleteFileById = async (fileId: number) => {
  try {
    const response = await api.delete(`/files/${fileId}`);
    console.log("File deleted successfully:", response.data);
  } catch (error: any) {
    if (error.response) {
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
};

export default api;

export const fetchMe = async () => {
  const token = await storage.getItem('token');
  if (!token) {
    console.log("No token found");
    return null;
  }
  try {
    const response = await fetch(`http://${ip}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return data;
    }
    console.log("Error fetching user data: ", data);
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const fetchUsers = async () => {
  const token = await storage.getItem('token');
  if (!token) {
    console.log("No token found");
    return null;
  }
  try {
    const response = await fetch(`http://${ip}/api/users/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return data;
    }
    console.log("Error fetching user data: ", data);
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const deleteUser = async (email: string) => {
  const token = await storage.getItem('token');
  if (!token) {
    console.log("No token found");
    return null;
  }
  try {
    const response = await fetch(`http://${ip}/api/users/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (response.status === 200) {
      return response;
    }
    const data = await response.json();
    console.log("Error deleting user: ", data);
    return null;
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
};

export const addUser = async (email: string, accessLevel: number) => {
  const token = await storage.getItem('token');
  if (!token) {
    console.log("No token found");
    return null;
  }
  try {
    const response = await fetch(`http://${ip}/api/users/add`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, accessLevel }),
    });
    if (response.status === 200) {
      return response;
    }
    const data = await response.json();
    console.log("Error adding user: ", data);
    return null;
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
};
