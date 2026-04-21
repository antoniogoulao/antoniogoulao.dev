import {getPostSlugs, getPostMeta, getAllPosts} from '@/lib/mdx';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: (...args: string[]) => args.join('/'),
}));

const FAKE_MDX = `---
title: Hello World
date: "2026-04-19"
excerpt: My first post.
tags: ["personal"]
---

Post content here.`;

describe('getPostSlugs', () => {
  it('returns slugs stripped of .mdx extension', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readdirSync as jest.Mock).mockReturnValue([
      'hello-world.mdx',
      'second.mdx',
      'ignore.ts',
    ]);
    expect(getPostSlugs('en-GB')).toEqual(['hello-world', 'second']);
  });

  it('returns empty array when directory does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    expect(getPostSlugs('en-GB')).toEqual([]);
  });
});

describe('getPostMeta', () => {
  it('parses frontmatter fields correctly', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(FAKE_MDX);
    const meta = getPostMeta('hello-world', 'en-GB');
    expect(meta).toEqual({
      slug: 'hello-world',
      title: 'Hello World',
      date: '2026-04-19',
      excerpt: 'My first post.',
      tags: ['personal'],
    });
  });
});

describe('getAllPosts', () => {
  it('returns posts sorted newest first', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readdirSync as jest.Mock).mockReturnValue(['old.mdx', 'new.mdx']);
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce('---\ntitle: Old\ndate: "2025-01-01"\nexcerpt: Old.\n---\n')
      .mockReturnValueOnce('---\ntitle: New\ndate: "2026-01-01"\nexcerpt: New.\n---\n');
    const posts = getAllPosts('en-GB');
    expect(posts[0].title).toBe('New');
    expect(posts[1].title).toBe('Old');
  });
});