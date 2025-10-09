import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    },
    hmr: {
      overlay: false
    },
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**']
    }
  },
  // Additional optimizations
  esbuild: {
    target: 'es2020'
  },
  optimizeDeps: {
    exclude: ['fsevents']
  }
})
