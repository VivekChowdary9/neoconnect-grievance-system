import axios from "axios";


const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error?.response?.data || error.message || error
    );
    return Promise.reject(error);
  }
);

export default API;