import { defineCollection, z } from 'astro:content';

const experiments = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    status: z.enum(['active', 'paused', 'archived', 'in-progress']),
    link: z.string().url().optional(),
    timestamp: z.string().optional(),
  }),
});

export const collections = {
  experiments,
};
