import axios from 'axios';

const api = axios.create({
  baseURL: 'https://student-chat.online/api',
  withCredentials: true,
});

export default api;