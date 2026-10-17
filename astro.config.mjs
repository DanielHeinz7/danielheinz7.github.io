import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://danielheinz7.github.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
