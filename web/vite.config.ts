import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.PARTY_GAMES_DEV_WEB_HOST ?? '127.0.0.1',
    port: Number(process.env.PARTY_GAMES_DEV_WEB_PORT ?? 43202),
    strictPort: true,
  },
})
