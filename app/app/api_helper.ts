import axios from "axios";

const api = axios.create({
    baseURL: "http://164.8.162.99:3000/api",
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