import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';
import {getPostMeta, getPostSlugs} from '@/lib/mdx';
import {SITE_URL} from '@/lib/seo';

export const dynamic = 'force-static';

function languages(path: string) {
  return Object.fromEntries(
    routing.locales.map(l => [l, `${SITE_URL}/${l}${path}/`]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of ['', '/blog', '/books']) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}/`,
        alternates: {languages: languages(path)},
      });
    }
    for (const slug of getPostSlugs(locale)) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}/`,
        lastModified: getPostMeta(slug, locale).date,
      });
    }
  }
  return entries;
}
