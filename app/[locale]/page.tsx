import {setRequestLocale} from 'next-intl/server';
import {Hero} from '@/components/home/Hero';
import {About} from '@/components/home/About';
import {Experience} from '@/components/home/Experience';
import {Skills} from '@/components/home/Skills';
import {Projects} from '@/components/home/Projects';
import {Contact} from '@/components/home/Contact';
import {fetchGitHubRepos} from '@/lib/github';
import {localeAlternates, personLd} from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  return {alternates: localeAlternates('', locale)};
}

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const repos = await fetchGitHubRepos('antoniogoulao');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(personLd)}}
      />
      <Hero locale={locale} />
      <About />
      <Experience />
      <Skills />
      <Projects repos={repos} />
      <Contact />
    </>
  );
}
