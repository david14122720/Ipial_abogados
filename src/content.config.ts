import { defineCollection, z } from "astro:content";

const servicios = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    order: z.number().default(0),
  }),
});

const abogados = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    role: z.string(),
    specialties: z.array(z.string()),
    description: z.string(),
    image: z.string().optional(),
    academic: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { servicios, abogados };
