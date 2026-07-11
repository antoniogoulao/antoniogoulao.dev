import type {Metadata} from 'next';
import {routing} from '@/i18n/routing';
import {SITE_URL} from '@/lib/seo';
import '../globals.css';

export const metadata: Metadata = {
  title: 'António Goulão',
  alternates: {canonical: `${SITE_URL}/${routing.defaultLocale}/`},
};

export default function RootRedirectLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang={routing.defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
