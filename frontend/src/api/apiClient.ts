
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const user = useAuthStore.getState().user;

        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }

        console.log('API Request:', config.method?.toUpperCase(), config.url);

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('Response Error:', error);

        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }

        return Promise.reject(error);
    }
);
