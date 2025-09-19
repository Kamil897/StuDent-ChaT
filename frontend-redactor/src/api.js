import axios from "axios";

// === Клиенты ===
const API_RED = axios.create({ baseURL: "http://localhost:4000/api", timeout: 60000 });
const API_LOGIN = axios.create({ baseURL: "http://localhost:3000", timeout: 60000 });

// === Интерцептор токена для API_RED ===
API_RED.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// === Функции генерации ===
export async function generateText(prompt) {
  const res = await API_RED.post("/generate-text", { prompt });
  return res.data;
}

export async function generateImage(prompt) {
  const res = await API_RED.post("/generate-image", { prompt });
  return res.data;
}

export async function uploadFile(formData) {
  const res = await API_RED.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function listAssets() {
  const res = await API_RED.get("/assets");
  return res.data;
}

export async function inpaint(imageB64, maskB64, prompt) {
  const res = await API_RED.post("/inpaint", { imageB64, maskB64, prompt });
  return res.data;
}

export async function generateBackground(prompt) {
  const res = await API_RED.post("/generate-background", { prompt });
  return res.data;
}

// === Проекты ===
export async function listProjects() {
  const res = await API_RED.get("/projects");
  return res.data;
}

export async function saveProject(payload) {
  const res = await API_RED.post("/projects", payload);
  return res.data;
}

export async function listProjectVersions(projectId) {
  const res = await API_RED.get(`/projects/${projectId}/versions`);
  return res.data;
}

export async function restoreProjectVersion(projectId, versionId) {
  const res = await API_RED.post(`/projects/${projectId}/restore/${versionId}`);
  return res.data;
}

// === Шаблоны / стилизованный текст ===
export async function listTemplates() {
  const res = await API_RED.get("/templates");
  return res.data;
}

export async function generateStyledText(text, font, effect) {
  const res = await API_RED.post("/generate-styled-text", { text, font, effect });
  return res.data;
}

// === Экспорт ===
export async function exportPng(dataUrl) {
  const res = await API_RED.post("/export/png", { dataUrl }, { responseType: "blob" });
  return res;
}

export async function exportSvg(svg) {
  const res = await API_RED.post("/export/svg", { svg }, { responseType: "blob" });
  return res;
}

// === Логин только через backend-login ===
export async function loginWithBackendLogin(email, password) {
  const res = await API_LOGIN.post("/auth/login", { email, password });
  const { access_token, user } = res.data;
  if (access_token) localStorage.setItem("access_token", access_token);
  return { access_token, user };
}
