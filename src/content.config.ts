import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const postsCollection = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}'}),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    prev: z.string(),
    next: z.string(),
    tags: z.array(z.string())
  })
});

export const collections = {
  posts: postsCollection,
};
