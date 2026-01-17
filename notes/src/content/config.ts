import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    status: z.enum(['published', 'draft', 'archived']),
    updated: z.string().optional(),
    related: z.array(z.string()).optional(),
  }),
});

export const collections = {
  notes,
};
