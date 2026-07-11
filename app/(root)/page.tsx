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

const redirectScript = `(function(){var m=${JSON.stringify(LOCALE_MAP)};var l=navigator.language;var t=m[l]||m[l.split('-')[0]]||'${routing.defaultLocale}';location.replace('/'+t+'/');})();`;

// Static-export-friendly redirect: inline script picks the browser locale,
// meta refresh covers non-JS clients, links below cover everything else.
export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=/${routing.defaultLocale}/`} />
      <script dangerouslySetInnerHTML={{__html: redirectScript}} />
      <div className="px-6 py-24 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl mb-6">António Goulão</h1>
        <ul className="space-y-2">
          {routing.locales.map(l => (
            <li key={l}>
              <a className="underline" href={`/${l}/`}>
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
