import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

function postsDir(locale: string): string {
  return path.join(process.cwd(), 'content', 'posts', locale);
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
  const {title, date, excerpt, tags} = data;
  if (typeof title !== 'string' || typeof date !== 'string' || typeof excerpt !== 'string') {
    throw new Error(`Invalid frontmatter in "${slug}": title, date, excerpt must be strings`);
  }
  return {
    slug,
    title,
    date,
    excerpt,
    tags: Array.isArray(tags) ? tags.filter((t): t is string => typeof t === 'string') : undefined,
  };
}

export function getPostSlugs(locale: string): string[] {
  const dir = postsDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''));
}

export function getPostMeta(slug: string, locale: string): PostMeta {
  const raw = fs.readFileSync(path.join(postsDir(locale), `${slug}.mdx`), 'utf8');
  const {data} = matter(raw);
  return toMeta(slug, data as Record<string, unknown>);
}

export function getAllPosts(locale: string): PostMeta[] {
  return getPostSlugs(locale)
    .map(slug => getPostMeta(slug, locale))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostContent(slug: string, locale: string): {meta: PostMeta; content: string} {
  const raw = fs.readFileSync(path.join(postsDir(locale), `${slug}.mdx`), 'utf8');
  const {data, content} = matter(raw);
  return {meta: toMeta(slug, data as Record<string, unknown>), content};
}