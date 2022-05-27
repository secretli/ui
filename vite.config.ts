import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/s/api': {
        target: "https://gphrase.de",
        changeOrigin: true,
        secure: false
      }
    }
  }
})
