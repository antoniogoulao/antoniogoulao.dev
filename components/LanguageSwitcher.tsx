'use client';
import {useRouter, usePathname} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';

const LABELS: Record<Locale, string> = {
  'en-GB': 'EN',
  'pt-PT': 'PT',
  'es-ES': 'ES',
  'fr-FR': 'FR',
};

export function LanguageSwitcher({locale}: {locale: string}) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: Locale) {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || '/');
  }

  return (
    <div className="flex items-center gap-0.5">
      {routing.locales.map(l => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
            locale === l
              ? 'text-primary border border-primary'
              : 'text-muted hover:text-foreground border border-transparent'
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}