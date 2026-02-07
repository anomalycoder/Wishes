import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths work correctly on Vercel
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning limit for larger chunks
  }
})
