import { defineConfig } from 'astro/config';

// Publicare pe GitHub Pages, cu domeniul propriu https://22radar.com/ (fișierul public/CNAME)
export default defineConfig({
  site: 'https://22radar.com',
  base: '/',
  trailingSlash: 'always',
});
