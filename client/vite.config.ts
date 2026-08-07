import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In production Netlify rewrites /api/* to netlify/functions/*. Locally
    // that rewrite is `netlify dev`'s job, which serves on 8888 — so run
    // `npx netlify dev` and the dev server will reach the real functions.
    // Without it every /api/* call 404s against Vite's own static server.
    proxy: {
      '/api': 'http://localhost:8888',
    },
  },
})
