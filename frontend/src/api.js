import axios from "axios";
import { ACCESS_TOKEN, BACKEND } from "./constants";

const api = axios.create({
    baseURL: "http://localhost:8000",
    // baseURL: `${BACKEND}`,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const setupInterceptors = (refreshAccessToken) => {
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const isLoginRequest = error.config?.url?.includes("/api/auth/login");

            if (error.response?.status === 401 && !isLoginRequest) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    error.config.headers['Authorization'] = `Bearer ${newToken}`;
                    return api.request(error.config);
                }
            }
            return Promise.reject(error);
        }
    );
};

export default api;