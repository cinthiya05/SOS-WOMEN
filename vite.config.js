import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Only apply base path when building for production
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/SOS-WOMEN/' : '/', // ← fix here
}))
