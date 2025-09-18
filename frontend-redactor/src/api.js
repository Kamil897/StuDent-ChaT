import axios from 'axios';
const API = axios.create({ baseURL: '/api', timeout: 60000 });
export async function generateText(prompt) { const res = await API.post('/generate-text', { prompt }); return res.data; }
export async function generateImage(prompt) { const res = await API.post('/generate-image', { prompt }); return res.data; }
export async function uploadFile(formData) { const res = await API.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return res.data; }
export async function listAssets() { const res = await API.get('/assets'); return res.data; }
