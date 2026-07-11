import {setRequestLocale, getTranslations} from 'next-intl/server';
import {books} from '@/content/books';
import {SectionDivider} from '@/components/SectionDivider';
import {localeAlternates} from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'books'});
  return {
    title: t('heading'),
    description: t('subtitle'),
    alternates: localeAlternates('/books', locale),
  };
}

export default async function BooksPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('books');

  const byYear = books.reduce<Record<number, typeof books>>((acc, book) => {
    (acc[book.year] ??= []).push(book);
    return acc;
  }, {});

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={t('heading')} />
      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground mb-3">
        {t('heading')}
      </h1>
      <p className="text-muted mb-14 font-sans">{t('subtitle')}</p>

      {years.map(year => (
        <div key={year} className="mb-14">
          <p className="text-xs uppercase tracking-widest text-secondary mb-4 font-sans">
            {year}
          </p>
          <div className="divide-y divide-surface">
            {byYear[year].map(book => (
              <div
                key={`${book.title}-${book.author}`}
                className="py-4 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors font-sans">
                      {book.title}
                    </p>
                    <p className="text-muted text-sm font-sans">{book.author}</p>
                  </div>
                </div>
                {book.note && (
                  <p className="text-muted text-sm mt-2 italic font-serif">{book.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}