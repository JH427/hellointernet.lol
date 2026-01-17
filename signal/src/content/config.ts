import { defineCollection, z } from 'astro:content';

const signal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  signal,
};
