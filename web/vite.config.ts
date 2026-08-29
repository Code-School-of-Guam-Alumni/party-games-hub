import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: env.PARTY_GAMES_DEV_WEB_HOST || '127.0.0.1',
      port: Number(env.PARTY_GAMES_DEV_WEB_PORT || 43202),
      strictPort: true,
    },
  }
})
