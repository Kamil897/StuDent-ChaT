import axios from 'axios';

const redactorApi = axios.create({
	baseURL: import.meta.env.PROD ? 'https://student-chat.online/api/redactor' : 'http://localhost:7777/api/redactor',
});

redactorApi.interceptors.request.use((config) => {
	const token = localStorage.getItem('token') || localStorage.getItem('access_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export const AssetsAPI = {
	list(projectId?: number) {
		const params: any = {};
		if (projectId) params.projectId = projectId;
		return redactorApi.get('/assets', { params }).then(r => r.data);
	},
	create(data: { type: string; url?: string; content?: string; metadata?: any; projectId?: number; }) {
		return redactorApi.post('/assets', data).then(r => r.data);
	},
};

export const ProjectsAPI = {
	list() {
		return redactorApi.get('/projects').then(r => r.data);
	},
	save(data: { id?: number; name: string; items?: any }) {
		return redactorApi.post('/projects', data).then(r => r.data);
	},
};

export const AIAPI = {
	generateBackground(prompt: string) {
		return redactorApi.post('/ai/generate-background', { prompt }).then(r => r.data);
	},
	inpaint(payload: { imageBase64: string; maskBase64: string; prompt: string }) {
		return redactorApi.post('/ai/inpaint', payload).then(r => r.data);
	},
	textStyle(payload: { text: string; stylePrompt: string }) {
		return redactorApi.post('/ai/text-style', payload).then(r => r.data);
	},
};

export default redactorApi;