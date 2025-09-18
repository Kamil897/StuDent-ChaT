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
export async function inpaint(imageB64, maskB64, prompt) { const res = await API.post('/inpaint', { imageB64, maskB64, prompt }); return res.data; }
export async function generateBackground(prompt) { const res = await API.post('/generate-background', { prompt }); return res.data; }
export async function listProjects() { const res = await axios.get('/api/projects'); return res.data; }
export async function saveProject(payload) { const res = await axios.post('/api/projects', payload); return res.data; }
export async function listProjectVersions(projectId) { const res = await axios.get(`/api/projects/${projectId}/versions`); return res.data; }
export async function restoreProjectVersion(projectId, versionId) { const res = await axios.post(`/api/projects/${projectId}/restore/${versionId}`); return res.data; }
export async function listTemplates() { const res = await axios.get('/api/templates'); return res.data; }
export async function generateStyledText(text, font, effect) { const res = await axios.post('/api/generate-styled-text', { text, font, effect }); return res.data; }
export async function exportPng(dataUrl) { const res = await axios.post('/api/export/png', { dataUrl }, { responseType: 'blob' }); return res; }
export async function exportSvg(svg) { const res = await axios.post('/api/export/svg', { svg }, { responseType: 'blob' }); return res; }

export async function loginWithBackendLogin(email, password) {
  const res = await axios.post('http://localhost:3000/auth/login', { email, password });
  const { access_token, user } = res.data;
  if (access_token) localStorage.setItem('access_token', access_token);
  return { access_token, user };
}
