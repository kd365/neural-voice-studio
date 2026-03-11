import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/neural-voice-studio/',
  server: {
    port: 3000
  }
})
