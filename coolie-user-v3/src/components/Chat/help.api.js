// src/help.api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://your-api-endpoint.com", // Replace with your API base URL
});

export default api;
