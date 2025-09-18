import axios from 'axios';
const API = axios.create({ baseURL: '/api', timeout: 60000 });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export async function generateText(prompt) { const res = await API.post('/generate-text', { prompt }); return res.data; }
export async function generateImage(prompt) { const res = await API.post('/generate-image', { prompt }); return res.data; }
export async function uploadFile(formData) { const res = await API.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return res.data; }
export async function listAssets() { const res = await API.get('/assets'); return res.data; }

export async function loginWithBackendLogin(email, password) {
  const res = await axios.post('http://localhost:3000/auth/login', { email, password });
  const { access_token, user } = res.data;
  if (access_token) localStorage.setItem('access_token', access_token);
  return { access_token, user };
}
