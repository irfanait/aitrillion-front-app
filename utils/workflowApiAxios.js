import axios from "axios";
import { getToken, handleLogout } from "./authHelpers";
import router from "next/router";

const workflowApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WORKFLOW_API_URL,  // ✅ workflow-specific URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token
workflowApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken(); 
    if (token) {
      config.headers.Authorization = token;
    }
  }
  return config;
});

// 🛑 Handle unauthorized errors
workflowApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      handleLogout();
      router.push("/auth/login");
    }
    return Promise.reject(error);
  }
);

export default workflowApi;
