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
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    tags: data.tags as string[] | undefined,
  };
}

export function getAllPosts(locale: string): PostMeta[] {
  return getPostSlugs(locale)
    .map(slug => getPostMeta(slug, locale))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostContent(slug: string, locale: string): {meta: PostMeta; content: string} {
  const raw = fs.readFileSync(path.join(postsDir(locale), `${slug}.mdx`), 'utf8');
  const {data, content} = matter(raw);
  return {
    meta: {
      slug,
      title: data.title as string,
      date: data.date as string,
      excerpt: data.excerpt as string,
      tags: data.tags as string[] | undefined,
    },
    content,
  };
}