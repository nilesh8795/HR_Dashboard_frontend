import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0', // ✅ This line allows Render to detect the running port
    port: 5173,       // Optional: you can specify or let Render auto-detect
  },
})
