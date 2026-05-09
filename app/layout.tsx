import type {Metadata} from 'next';
import {Instrument_Serif, Space_Grotesk} from 'next/font/google';
import {ThemeProvider} from '@/components/ThemeProvider';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'António Goulão',
  description: 'Mobile Engineer · Rider · Reader',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className={`${instrumentSerif.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}