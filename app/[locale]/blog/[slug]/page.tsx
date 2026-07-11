import {setRequestLocale, getTranslations, getFormatter} from 'next-intl/server';
import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import {getPostContent, getPostMeta, getPostSlugs} from '@/lib/mdx';
import {routing} from '@/i18n/routing';
import {localeAlternates} from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const meta = getPostMeta(slug, locale);
  const localesWithPost = routing.locales.filter(l => getPostSlugs(l).includes(slug));
  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: localeAlternates(`/blog/${slug}`, locale, localesWithPost),
  };
}

export async function generateStaticParams() {
  const params: {locale: string; slug: string}[] = [];
  for (const locale of routing.locales) {
    const slugs = getPostSlugs(locale);
    for (const slug of slugs) {
      params.push({locale, slug});
    }
  }
  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const format = await getFormatter();
  const {meta, content} = getPostContent(slug, locale);

  return (
    <div className="px-6 py-12 max-w-2xl mx-auto">
      <Link
        href={`/${locale}/blog`}
        className="text-xs uppercase tracking-wide text-muted hover:text-foreground transition-colors mb-10 block font-sans"
      >
        {t('back')}
      </Link>

      <time dateTime={meta.date} className="text-xs text-muted uppercase tracking-wide mb-4 font-sans block">
        {format.dateTime(new Date(meta.date), {year: 'numeric', month: 'short', day: 'numeric'})}
      </time>

      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground mb-12 leading-tight">
        {meta.title}
      </h1>

      <div className="prose prose-stone dark:prose-invert max-w-none font-sans">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </div>
    </div>
  );
}