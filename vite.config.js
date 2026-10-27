import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, forward API calls to the local Worker (`npm run api`).
    // Production serves the site and API from the same Worker, so no proxy there.
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
