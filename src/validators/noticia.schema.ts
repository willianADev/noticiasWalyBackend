import { z } from "zod";

const estadoSchema = z.enum(["publicada", "borrador"]);

export const noticiaCrearSchema = z.object({
  titulo: z.string().trim().min(1, "El título es obligatorio").max(200),
  resumen: z.string().trim().min(1, "El resumen es obligatorio").max(300),
  contenido: z.string().min(1, "El contenido es obligatorio"),
  // formato YYYY-MM-DD
  fechaEvento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "fechaEvento inválida. Usa formato YYYY-MM-DD"),
  estado: estadoSchema.optional().default("publicada"),
});

export const noticiaPutSchema = noticiaCrearSchema; // reemplazo completo

export const noticiaPatchSchema = z
  .object({
    titulo: z.string().trim().min(1).max(200).optional(),
    resumen: z.string().trim().min(1).max(300).optional(),
    contenido: z.string().min(1).optional(),
    fechaEvento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "fechaEvento inválida. Usa formato YYYY-MM-DD")
      .optional(),
    estado: estadoSchema.optional(),
  })
  .strict();