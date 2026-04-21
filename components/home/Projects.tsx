'use client';
import {useRef} from 'react';
import {motion, useInView} from 'framer-motion';
import {useTranslations} from 'next-intl';
import type {GitHubRepo} from '@/lib/github';
import {SectionDivider} from '@/components/SectionDivider';

function ProjectCard({repo, index}: {repo: GitHubRepo; index: number}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, {once: true, margin: '-60px'});

  return (
    <motion.a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{opacity: 0, y: 20}}
      animate={inView ? {opacity: 1, y: 0} : {}}
      transition={{duration: 0.4, delay: index * 0.07}}
      whileHover={{y: -4, transition: {duration: 0.2}}}
      className="block bg-surface border border-surface rounded-lg p-5 hover:border-primary/40 transition-colors group"
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
    </motion.a>
  );
}

export function Projects({repos}: {repos: GitHubRepo[]}) {
  const t = useTranslations('sections');

  return (
    <section id="projects" className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={t('projects')} />
      <div className="grid sm:grid-cols-2 gap-4">
        {repos.map((repo, i) => (
          <ProjectCard key={repo.id} repo={repo} index={i} />
        ))}
      </div>
    </section>
  );
}