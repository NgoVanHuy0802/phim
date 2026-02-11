import axios from 'axios';

/**
 * Axios instance dùng chung cho frontend.
 * Có thể override VITE_API_URL trong .env của client.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

export default api;
