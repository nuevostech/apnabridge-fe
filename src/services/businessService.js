import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:5000/api", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Get Businesses
export const getBusinesses = (page = 1, limit = 10) => {
  return API.get(`/businesses?page=${page}&limit=${limit}`);
};

// Add Business
export const addBusiness = (businessData) => {
  return API.post("/businesses", businessData);
};

export default API;