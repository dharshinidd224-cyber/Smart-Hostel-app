import axios from "axios";

// Use VITE_API_URL env var if set, otherwise fall back to localhost.
// To point to a different machine set VITE_API_URL in a .env file at the
// project root, e.g.:  VITE_API_URL=http://192.168.1.50:5000
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("🔥 ACTUAL API URL:", API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;