// src/utils/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://student-chat.online/api'
    : 'http://localhost:7777/api',
  withCredentials: true, // для cookie
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.get('/auth/refresh'); // получаем новый access_token
        return api(originalRequest);    // повтор запроса
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
