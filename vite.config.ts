import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// v3 has its own host, so it is served from the root (no path prefix).
// The app always calls /api on its own origin: in development this server proxies it to the backend;
// in Stage and production the v3 web server does the same.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
      reporter: ['text-summary', 'html'],
      // The FE-React gate of openspec/sides.conf (AGENTS.md section 8.7): at least 15% of lines.
      thresholds: { lines: 15 },
    },
  },
});
