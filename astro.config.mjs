// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://ipialabogados.example.com",
  output: "static",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
  security: {
    checkOrigin: true,
  },
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});