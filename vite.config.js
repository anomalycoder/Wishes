import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './', // Removed to fix local dev and Vercel usually handles auto-detection fine
  build: {
    chunkSizeWarningLimit: 1000,
  }
})
