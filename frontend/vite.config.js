import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:7777',
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist',
    },
    define: {
      'process.env': env, 
    }
  };
});
