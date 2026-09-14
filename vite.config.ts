import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Pages serves this from /shareit-prototype/, not the domain root.
export default defineConfig({
  base: '/shareit-prototype/',
  plugins: [react(), tailwindcss()],
})
