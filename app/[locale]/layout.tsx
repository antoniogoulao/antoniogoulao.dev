import type {Metadata} from 'next';
import {Instrument_Serif, Space_Grotesk} from 'next/font/google';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {SITE_URL} from '@/lib/seo';
import {ThemeProvider} from '@/components/ThemeProvider';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';
import '../globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'meta'});
  return {
    metadataBase: new URL(SITE_URL),
    title: {default: 'António Goulão', template: '%s · António Goulão'},
    description: t('siteDescription'),
    openGraph: {
      siteName: 'António Goulão',
      type: 'website',
      locale,
      images: ['/og.png'],
    },
    twitter: {card: 'summary_large_image'},
  };
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale: localeParam} = await params;
  if (!(routing.locales as ReadonlyArray<string>).includes(localeParam)) notFound();
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations('nav');

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${instrumentSerif.variable} ${spaceGrotesk.variable} font-sans`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-background focus:px-3 focus:py-2 focus:rounded"
        >
          {t('skipToContent')}
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Nav locale={locale} />
            <main id="main">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
