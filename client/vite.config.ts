import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // The new v4 plugin
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Initialize Tailwind v4 here
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})