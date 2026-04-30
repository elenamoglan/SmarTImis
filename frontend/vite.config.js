import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://2t8f9kr3th.execute-api.eu-north-1.amazonaws.com/dev',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://2t8f9kr3th.execute-api.eu-north-1.amazonaws.com/dev',
        changeOrigin: true,
      }
    }
  }
})
