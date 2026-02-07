import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './', // Removed to fix local dev and Vercel usually handles auto-detection fine
  build: {
    chunkSizeWarningLimit: 1600, // Increased limit for Three.js heavy apps
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'framer-motion'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-anim': ['gsap', '@react-spring/three', '@react-spring/web'],
          'vendor-utils': ['canvas-confetti', 'react-confetti-explosion', 'fireworks-js']
        }
      }
    }
  }
})
