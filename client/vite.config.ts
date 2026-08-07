/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vitest reuses this config, which is the reason to prefer it over Jest
  // here: no second build pipeline and no separate transform setup.
  // jsdom because helper/storage.ts talks to localStorage and matchMedia.
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
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
