import axios from 'axios';

/**
 * Axios instance dùng chung cho frontend.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

/**
 * Helper lấy Authorization header từ localStorage.
 */
export const getAuthConfig = () => {
  const token = localStorage.getItem('token');

  return {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  };
};

export default api;
