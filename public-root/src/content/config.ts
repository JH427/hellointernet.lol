import { defineCollection, z } from 'astro:content';

const artifacts = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    status: z.enum(['active', 'archived', 'ongoing']),
    link: z.string().url().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  artifacts,
};
