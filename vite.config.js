import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Increase chunk size warning limit (in KB) to reduce noisy warnings for larger chunks
  build: {
    chunkSizeWarningLimit: 2000
  }
});
