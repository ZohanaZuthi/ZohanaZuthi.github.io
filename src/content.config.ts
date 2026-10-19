import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const common = {
  title: z.string().min(1),
  summary: z.string().min(1),
  date: z.coerce.date(),
  image: z.string().optional(),
  published: z.boolean().default(false),
};

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    ...common,
    featured: z.boolean().default(false),
    category: z.string().optional(),
    link: z.string().optional(),
    source: z.string().optional(),
  }),
});

const research = defineCollection({
  loader: glob({ base: './src/content/research', pattern: '**/*.md' }),
  schema: z.object({
    ...common,
    venue: z.string().optional(),
    link: z.string().optional(),
    pdf: z.string().optional(),
  }),
});

const certificates = defineCollection({
  loader: glob({ base: './src/content/certificates', pattern: '**/*.md' }),
  schema: z.object({
    ...common,
    issuer: z.string().optional(),
    link: z.string().optional(),
    pdf: z.string().optional(),
  }),
});

const achievements = defineCollection({
  loader: glob({ base: './src/content/achievements', pattern: '**/*.md' }),
  schema: z.object({
    ...common,
    organization: z.string().optional(),
    featureCover: z.boolean().default(false),
    gallery: z.array(z.object({ image: z.string().min(1), caption: z.string().optional(), title: z.string().optional(), featured: z.boolean().default(false) })).default([]),
    link: z.string().optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ base: './src/content', pattern: 'gallery/**/*.md' }),
  schema: z.object({
    ...common,
    image: z.string().min(1),
    featured: z.boolean().default(false),
    location: z.string().optional(),
    link: z.string().optional(),
  }),
});

export const collections = { projects, research, certificates, achievements, gallery };
