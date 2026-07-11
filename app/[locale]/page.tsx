import {setRequestLocale} from 'next-intl/server';
import {Hero} from '@/components/home/Hero';
import {About} from '@/components/home/About';
import {Experience} from '@/components/home/Experience';
import {Projects} from '@/components/home/Projects';
import {Contact} from '@/components/home/Contact';
import {fetchGitHubRepos} from '@/lib/github';

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
      <Hero locale={locale} />
      <About />
      <Experience />
      <Projects repos={repos} />
      <Contact />
    </>
  );
}
