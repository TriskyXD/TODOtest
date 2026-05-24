import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Forward all /todos requests to the Go backend in development
      '/todos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    // Pre-bundle the icons package so Vite doesn't scan hundreds of individual files
    include: ['@untitled-ui/icons-react'],
  },
})
