'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {routing} from '@/i18n/routing';

const LOCALE_MAP: Record<string, string> = {
  'pt': 'pt-PT',
  'pt-PT': 'pt-PT',
  'pt-BR': 'pt-PT',
  'es': 'es-ES',
  'es-ES': 'es-ES',
  'fr': 'fr-FR',
  'fr-FR': 'fr-FR',
  'en': 'en-GB',
  'en-GB': 'en-GB',
  'en-US': 'en-GB',
  'en-AU': 'en-GB',
};

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const lang = navigator.language;
    const matched =
      LOCALE_MAP[lang] ??
      LOCALE_MAP[lang.split('-')[0]] ??
      routing.defaultLocale;
    router.replace(`/${matched}`);
  }, [router]);

  return null;
}