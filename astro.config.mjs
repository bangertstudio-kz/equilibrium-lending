// @ts-check
import { defineConfig } from 'astro/config';

// Same URL scheme as bangertstudio.kz: Russian at "/", other languages
// under a prefix, no Accept-Language redirect.
export default defineConfig({
  site: 'https://equilibrium.bangertstudio.kz',
  trailingSlash: 'never',
  i18n: {
    locales: ['ru', 'en', 'kk', 'pt', 'es', 'meow'],
    defaultLocale: 'ru',
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
});
