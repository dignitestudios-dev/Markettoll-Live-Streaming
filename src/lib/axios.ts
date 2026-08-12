import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "@/api/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    if (!config.headers.Authorization) {
      const token =
        Cookies.get("auth-token") ||
        localStorage.getItem("auth-token") ||
        (() => {
          try {
            const userStr = localStorage.getItem("user") || localStorage.getItem("auth-user");
            return userStr ? JSON.parse(userStr)?.token : null;
          } catch {
            return null;
          }
        })();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
