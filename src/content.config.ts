import { defineCollection } from 'astro:content';
import { portfolioList } from './loaders/portfolio-list';
import { z } from 'astro/zod';

const common = {
  title: z.string().min(1),
  summary: z.string().min(1),
  date: z.coerce.date(),
  order: z.number().nonnegative().nullish(),
  image: z.string().optional(),
  published: z.boolean().default(false),
  listPosition: z.number(),
};

const photoGallery = z.array(z.object({
  image: z.string().min(1), caption: z.string().optional(), title: z.string().optional(),
  featured: z.boolean().default(false),
  homepage: z.boolean().default(false),
  order: z.number().nonnegative().nullish(),
})).default([]);

const projects = defineCollection({
  loader: portfolioList('projects'),
  schema: z.object({
    ...common,
    featured: z.boolean().default(false),
    category: z.string().optional(),
    featureCover: z.boolean().default(false),
    homepageCover: z.boolean().default(false),
    gallery: photoGallery,
    link: z.string().optional(),
    source: z.string().optional(),
  }),
});

const research = defineCollection({
  loader: portfolioList('research'),
  schema: z.object({
    ...common,
    venue: z.string().optional(),
    link: z.string().optional(),
    pdf: z.string().optional(),
  }),
});

const certificates = defineCollection({
  loader: portfolioList('certificates'),
  schema: z.object({
    ...common,
    issuer: z.string().optional(),
    featureCover: z.boolean().default(false),
    homepageCover: z.boolean().default(false),
    link: z.string().optional(),
    pdf: z.string().optional(),
  }),
});

const achievements = defineCollection({
  loader: portfolioList('achievements'),
  schema: z.object({
    ...common,
    organization: z.string().optional(),
    featureCover: z.boolean().default(false),
    homepageCover: z.boolean().default(false),
    gallery: photoGallery,
    link: z.string().optional(),
  }),
});

const gallery = defineCollection({
  loader: portfolioList('gallery'),
  schema: z.object({
    ...common,
    image: z.string().min(1),
    featured: z.boolean().default(false),
    location: z.string().optional(),
    link: z.string().optional(),
  }),
});

export const collections = { projects, research, certificates, achievements, gallery };
