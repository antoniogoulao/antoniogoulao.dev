import {routing} from '@/i18n/routing';

export const SITE_URL = 'https://antoniogoulao.dev';

/** Canonical + hreflang alternates for a route, trailing slashes included (trailingSlash: true). */
export function localeAlternates(path: string, locale: string, locales: readonly string[] = routing.locales) {
  return {
    canonical: `/${locale}${path}/`,
    languages: {
      ...Object.fromEntries(locales.map(l => [l, `/${l}${path}/`])),
      'x-default': `/${routing.defaultLocale}${path}/`,
    },
  };
}
