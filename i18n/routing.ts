import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en-GB', 'pt-PT', 'es-ES', 'fr-FR'],
  defaultLocale: 'en-GB',
});

export type Locale = (typeof routing.locales)[number];