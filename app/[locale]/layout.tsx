import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {HtmlLang} from '@/components/HtmlLang';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';

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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLang locale={locale} />
      <Nav locale={locale} />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}