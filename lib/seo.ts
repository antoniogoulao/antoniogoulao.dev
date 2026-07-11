import {routing} from '@/i18n/routing';

export const SITE_URL = 'https://antoniogoulao.dev';

export const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'António Goulão',
  jobTitle: 'Senior Mobile & Frontend Developer',
  worksFor: {'@type': 'Organization', name: 'UpHill, S.A.'},
  alumniOf: {'@type': 'CollegeOrUniversity', name: 'Instituto Superior Técnico'},
  url: SITE_URL,
  sameAs: [
    'https://github.com/antoniogoulao',
    'https://www.linkedin.com/in/antoniomgoulao/',
    'https://bsky.app/profile/antoniogoulao.dev',
  ],
};

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
