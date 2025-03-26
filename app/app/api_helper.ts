import axios from "axios";

const api = axios.create({
    baseURL: "http://172.29.112.1:3000/api",
    timeout: 10000, 
    headers: { 
      "Content-Type": "application/json",
    },
  });

  export const fetchData = async (path: string): Promise<any> => {
    try {
      const response = await api.get(path);
      console.log("Fetched data:", response.data);
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
        console.log(response.data);

        return response.data;
    } catch (error) {
        console.error("Error submitting Event creation data:", error);
        throw error;
    }
};

export default {fetchData, submitEvent};