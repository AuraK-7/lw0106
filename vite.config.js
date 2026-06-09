import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 配置文件，保持默认开发体验并便于课程作业演示。
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
