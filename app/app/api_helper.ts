import axios from "axios";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import alert from "./alert";
import { router } from "expo-router";
import * as storage from "./storage";
import { Platform } from 'react-native';

const ip = "193.2.219.130";
const api = axios.create({
  baseURL: `https://${ip}/api`,
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
    console.error(
      "Error fetching data with path:",
      path,
      " ---- Error: ",
      error
    );
    throw error;
  }
};

export const uploadFile = async (
  fileInput: any,
  filename: string,
  path: string
) => {
  try {
    const token = await storage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const isWeb = Platform.OS === 'web';

    const formData = new FormData();
    formData.append("name", filename);
    formData.append("path", path);

    formData.append("file", isWeb ? fileInput.file : {
      uri: fileInput.uri,
      name: filename,
      type: fileInput.mimeType || fileInput.type,
    } as any);

    const response = await fetch(`https://${ip}/api/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT manually set Content-Type — browser/React Native will do it
      },
      body: formData,
    });

    const result = await response.json();
    console.log("Upload success:", result);
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};


export const uploadFileEvent = async (
  fileInput: any,
  filename: string,
  path: string,
  eventId: string
) => {
  try {
    const response = await uploadFile(fileInput, filename, path);
    const result = addFileToEvent(Number(eventId), response.id);
    router.back();
    return result;
  } catch (error) {
    alert("Napaka pri dogajanju gradiva k dogodku", "Opozorilo");
  }
};

export const submitEvent = async (
  title: string,
  description: string,
  coordinator: string,
  date: string,
  from: string | null,
  to: string | null
) => {
  if (!title || !description || !coordinator || !date) {
    throw new Error("Missing required fields");
  }

  const token = await storage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`https://${ip}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        coordinator,
        description,
        start: date,
        ...(from && to ? { from_date: from, to_date: to } : {}),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting Event creation data: ", error);
    throw error;
  }
};

export const submitUpdateEvent = async (
  id: string,
  title: string,
  description: string,
  coordinator: string,
  date: string,
  from: string | null,
  to: string | null
) => {
  // 1) Validate inputs
  if (!id || !title || !description || !coordinator || !date) {
    throw new Error("Missing required fields for update");
  }

  // 2) Retrieve auth token
  const token = await storage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  // 3) Build request body
  const body: any = { title, coordinator, description, start: date };
  if (from && to) {
    body.from_date = from;
    body.to_date = to;
  }

  // 4) Send PUT request
  const response = await fetch(`https://${ip}/api/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  // 5) Handle error status
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(
      errData.message || `Failed to update event (status ${response.status})`
    );
  }

  // 6) Return parsed JSON
  return response.json();
};

export const deleteEventById = async (id: number) => {
  if (!id) {
    throw new Error("Event ID is required for deletion");
  }

  // 1) Retrieve auth token
  const token = await storage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  // 2) Send DELETE request
  const response = await fetch(`https://${ip}/api/events/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // 3) Handle error status
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(
      errData.message || `Failed to delete event (status ${response.status})`
    );
  }

  // 4) Return parsed JSON
  return response.json();
};

export const fetchAndOpenFile = async (uuid: string, fileName: string) => {
  try {
    const downloadUrl = `https://${ip}/api/files/${uuid}/content`;

    if (Platform.OS === 'web') {
      // Web download via anchor tag
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName; // suggest a file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("File download triggered on web.");
    } else {
      // Native (mobile) download via FileSystem and Sharing
      const fileExtension = fileName.split(".").pop() || "pdf";
      const fileUri = `${FileSystem.documentDirectory}${fileName}.${fileExtension}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      if (uri) {
        console.log("File downloaded to:", uri);
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert("Error", "File sharing is not available on this device.");
        }
      }
    }
  } catch (error) {
    console.error("Error downloading or opening file:", error);
    Alert.alert("Error", "Failed to open file.");
  }
};

export const fetchFileUri = async (uuid: string) => {
  const downloadResumable = FileSystem.createDownloadResumable(
    `https://${ip}/api/files/${uuid}/content`,
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
    const token = await storage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return await api.post(`/events/${id}/files`, { fileId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (error) {
    console.log("Response: ______ ", error);
  }
};

export const deleteFileById = async (fileId: number) => {
  try {
    const token = await storage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.delete(`/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("File deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Server responded with error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
};

export default api;

export const fetchMe = async () => {
  const token = await storage.getItem("token");
  if (!token) {
    console.log("No token found");
    return null;
  }
  try {
    const response = await fetch(`https://${ip}/api/users/me`, {
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
  const token = await storage.getItem("token");
  if (!token) {
    console.log("No token found");
    return null;
  }
  try {
    const response = await fetch(`https://${ip}/api/users/list`, {
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
  const token = await storage.getItem("token");
  if (!token) {
    console.log("No token found");
    return null;
  }
  try {
    const response = await fetch(`https://${ip}/api/users/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
  const token = await storage.getItem("token");
  if (!token) {
    console.log("No token found");
    return null;
  }
  try {
    const response = await fetch(`https://${ip}/api/users/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
