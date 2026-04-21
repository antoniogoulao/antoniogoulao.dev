import Link from 'next/link';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {getAllPosts} from '@/lib/mdx';
import {SectionDivider} from '@/components/SectionDivider';

export default async function BlogPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = getAllPosts(locale);

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={t('heading')} />
      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground mb-3">
        {t('heading')}
      </h1>
      <p className="text-muted mb-14 font-sans">{t('subtitle')}</p>

      {posts.length === 0 ? (
        <p className="text-muted font-sans">{t('noPosts')}</p>
      ) : (
        <div className="divide-y divide-surface">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="block py-8 group"
            >
              <p className="text-xs text-muted uppercase tracking-wide mb-2 font-sans">
                {post.date}
              </p>
              <h2 className="font-serif italic text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors mb-3">
                {post.title}
              </h2>
              <p className="text-muted text-sm leading-relaxed font-sans">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}