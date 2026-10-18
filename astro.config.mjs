import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://daniel-heinz.de',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
