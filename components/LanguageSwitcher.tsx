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
    const {search, hash} = window.location;
    router.push(`${segments.join('/')}${search}${hash}`);
  }

  return (
    <div role="group" aria-label="Language" className="flex items-center gap-0.5">
      {routing.locales.map(l => (
        <button
          key={l}
          type="button"
          onClick={() => switchLocale(l)}
          aria-current={locale === l ? 'true' : undefined}
          aria-label={`Switch to ${LABELS[l]}`}
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