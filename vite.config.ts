import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/St_benedict_website/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        academics: resolve(__dirname, 'academics.html'),
        admissions: resolve(__dirname, 'admissions.html'),
        teachers: resolve(__dirname, 'teachers.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
