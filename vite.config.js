import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()], 
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,      // Specify the port
    strictPort: true, // Prevent automatic port increment if 5173 is in use
    open: true,      // Optionally open browser on server start
  },
  preview: {
    port: 5173,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'build', // Optional: specify build output directory
    sourcemap: true  // Optional: generate source maps for debugging
  }
})
