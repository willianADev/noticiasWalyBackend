import { z } from 'zod';

export const esquemaCrearNoticia = z.object({
  body: z.object({
    titulo: z.string()
      .min(5, 'El título debe tener al menos 5 caracteres')
      .max(150, 'El título es demasiado largo'),
    
    contenido: z.string()
      .min(20, 'El contenido debe tener al menos 20 caracteres'),

    tipo: z.enum(['ACTUALIDAD', 'DEPORTES', 'TECNOLOGIA', 'POLITICA', 'AVISOS'])
      .refine(val => val !== undefined, { message: 'El tipo de noticia es un campo requerido' }),
    
    fechaPublicacion: z.string()
      .datetime({ message: "Formato de fecha inválido (ISO 8601 requerido)" })
      .optional(),
  })
});

export const esquemaPaginacion = z.object({
  query: z.object({
    pagina: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
    limite: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
  })
});