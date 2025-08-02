import { backendBaseUrl } from "@/lib/constant";
import axios from "axios";
import { toast } from "sonner";

// Create axios instance with base configuration
export const Axios = axios.create({
  baseURL: backendBaseUrl,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging and any request modifications
const getRequestConfig = (config) => {
  return config;
};

const getRequestError = (error) => {
  console.error("Request Error:", error);
  return Promise.reject(error);
};

// Response interceptor for global error handling
const getResponseError = async (error) => {
  const endpoint = error.config?.url || "unknown";

  if (error?.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        console.error("Bad Request:", endpoint);
        break;
      case 401:
        console.error("Unauthorized:", endpoint);
        break;
      case 403:
        console.error("Forbidden:", endpoint);
        break;
      case 404:
        console.error("Not Found:", endpoint);
        break;
      case 500:
        console.error("Internal Server Error:", endpoint);
        break;
      case 502:
        console.error("Bad Gateway:", endpoint);
        break;
      case 503:
        console.error("Service Unavailable:", endpoint);
        break;
      case 504:
        console.error("Gateway Timeout:", endpoint);
        break;
      default:
        console.error(`HTTP ${status} Error:`, endpoint);
        break;
    }
    // Handle error messages from server
    if (data?.errors && Array.isArray(data.errors)) {
      data?.errors.forEach((error) => {
        toast.error(error?.message || "Something went wrong!");
      });
    } else if (data?.message) {
      toast.error(data.message);
    } else {
      toast.error("Something went wrong!");
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error("Network Error - No Response:", endpoint);
    toast.error("Network error. Please check your connection");
  } else {
    // Something else happened
    toast.error(error.message || "Something went wrong!");
  }

  return Promise.reject(error);
};

// Response interceptor for successful responses
const getResponseConfig = (response) => {
  return response?.data;
};

// Apply interceptors
Axios.interceptors.request.use(getRequestConfig, getRequestError);
Axios.interceptors.response.use(getResponseConfig, getResponseError);

export default Axios;
