// Taxonomía: Ipialabogados.md §2-§4 — fuente canónica. Enums estrictos; build falla si reingresa "Derecho Civil"/inventados (§6).
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const servicios = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/servicios" }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      grupo: z.enum(["trabajadores", "empleadores", "pensionados", "penal"]),
      abogado: z.enum(["omar", "franco"]),
      order: z.number().default(0),
    })
    .refine((v) => (v.abogado === "franco") === (v.grupo === "penal"), {
      message: "§6 cross-attribution: franco ↔ penal debe coincidir",
    }),
});

const abogados = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/abogados" }),
  schema: z.object({
    name: z.enum(["Omar Enrique Ipial Ipial", "Franco Miller Ipial Ipial"]),
    specialty: z.enum([
      "Especialista en Derecho Laboral y Seguridad Social",
      "Especialista en Derecho Penal y Procesal Penal",
    ]),
    order: z.number().default(0),
  }),
});

export const collections = { servicios, abogados };
