import axios from 'axios';

const API = 'https://student-chat.online'; // заменишь на свой IP / domain

export const register = async (data: {
  email: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'PARENT' | 'TEACHER' | 'USER';
}) => {
  const res = await axios.post(`${API}/register`, data);
  return res.data;
};

export const login = async (data: {
  emailOrUsername: string;
  password: string;
  role: 'ADMIN' | 'PARENT' | 'TEACHER' | 'USER';
}) => {
  const res = await axios.post(`${API}/login`, data);
  return res.data;
};