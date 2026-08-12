import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  // We don't use Vite's own static-asset copying — Fastify already serves
  // the whole public/ folder via @fastify/static — and outDir lives inside
  // public/, so disable it to avoid Vite recursively copying public/ into
  // itself on every build.
  publicDir: false,
  build: {
    outDir: 'public/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'frontend/main.jsx',
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'main-[hash].js',
        assetFileNames: 'main.[ext]',
      },
    },
  },
});
