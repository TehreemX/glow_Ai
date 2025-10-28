import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Final Config for your GitHub repo: glow_Ai
export default defineConfig({
  base: '/glow_Ai/',  // 👈 repo name exactly as it appears on GitHub
  plugins: [react()],
})
