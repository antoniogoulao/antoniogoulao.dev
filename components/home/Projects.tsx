import {useTranslations} from 'next-intl';
import type {GitHubRepo} from '@/lib/github';
import {SectionDivider} from '@/components/SectionDivider';

const FEATURED = [
  {
    key: 'rideAndListen',
    name: 'Ride & Listen',
    href: 'https://rideandlisten.antoniogoulao.dev',
    tags: ['Side project', 'Since 2021'],
  },
  {
    key: 'lanyard',
    name: 'Lanyard',
    href: null,
    tags: ['Node.js', 'Playwright', 'TypeScript'],
  },
  {
    key: 'thisSite',
    name: 'antoniogoulao.dev',
    href: 'https://github.com/antoniogoulao/antoniogoulao.dev',
    tags: ['Next.js', 'TypeScript', 'Claude Code'],
  },
] as const;

function FeaturedCard({name, href, description, tags}: {
  name: string;
  href: string | null;
  description: string;
  tags: readonly string[];
}) {
  const className = 'block bg-surface border border-surface rounded-lg p-5 hover:border-primary/40 transition-colors group';
  const inner = (
    <>
      <h3 className="font-semibold text-foreground mb-1.5 font-sans group-hover:text-primary transition-colors">
        {name}
        {href && ' ↗'}
      </h3>
      <p className="text-muted text-sm mb-4 leading-relaxed font-sans">{description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary font-sans">
        {tags.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <div className={className}>{inner}</div>
  );
}

function ProjectCard({repo, index}: {repo: GitHubRepo; index: number}) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="anim-fade-up block bg-surface border border-surface rounded-lg p-5 hover:border-primary/40 hover:-translate-y-1 transition group"
      style={{animationDelay: `${index * 70}ms`}}
    >
      <h3 className="font-semibold text-foreground mb-1.5 font-sans group-hover:text-primary transition-colors">
        {repo.name}
      </h3>
      {repo.description && (
        <p className="text-muted text-sm mb-4 leading-relaxed font-sans">{repo.description}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-muted font-sans">
        {repo.language && <span className="text-secondary">{repo.language}</span>}
        <span>★ {repo.stargazers_count}</span>
      </div>
    </a>
  );
}

export function Projects({repos}: {repos: GitHubRepo[]}) {
  const t = useTranslations('sections');
  const tp = useTranslations('projects');

  return (
    <section id="projects" className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={t('projects')} />
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {FEATURED.map(item => (
          <FeaturedCard
            key={item.key}
            name={item.name}
            href={item.href}
            description={tp(item.key)}
            tags={item.tags}
          />
        ))}
      </div>
      {repos.length > 0 && (
        <>
          <h3 className="text-xs uppercase tracking-widest text-muted mb-4 font-sans">
            {tp('moreOnGitHub')}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {repos.map((repo, i) => (
              <ProjectCard key={repo.id} repo={repo} index={i} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
