import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        console.log("API Request:", config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log("API Response:", response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error("Response Error:", error);
        return Promise.reject(error);
    }
);