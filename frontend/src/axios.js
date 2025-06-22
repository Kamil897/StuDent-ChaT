// import axios from 'axios';

// const instance = axios.create({
//   baseURL: import.meta.env.PROD
//     ? 'https://student-chat.online/api'
//     : 'http://localhost:7777/api',
//   withCredentials: true,
// });

// // Интерцептор: если 401 → попробовать refresh
// instance.interceptors.response.use(
//   res => res,
//   async err => {
//     const originalRequest = err.config;

//     if (err.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshRes = await instance.post('/auth/refresh');
//         const accessToken = refreshRes.data.accessToken;
//         localStorage.setItem('access_token', accessToken);
//         originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
//         return instance(originalRequest);
//       } catch (e) {
//         localStorage.clear();
//         window.location.href = '/login';
//       }
//     }

//     return Promise.reject(err);
//   }
// );

// export default instance;
