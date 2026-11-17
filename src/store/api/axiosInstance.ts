import axios, { AxiosError } from "axios";
import { getApiErrorMessage } from "@/lib/utils/apiError";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});


axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const readableMessage = getApiErrorMessage(error);
    if (axios.isAxiosError(error)) {
      error.message = readableMessage;
      (error as AxiosError & { userMessage?: string }).userMessage = readableMessage;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
