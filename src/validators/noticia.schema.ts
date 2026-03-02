import { z } from 'zod';

const categoriasValidas = ['nacionales', 'internacionales', 'deportes', 'tecnologia'] as const;

export const EsquemaCrearNoticia = z.object({
  body: z.object({
    titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(150, 'El título es muy largo'),
    resumen: z.string().min(10, 'El resumen debe tener al menos 10 caracteres').max(300, 'El resumen es muy largo'),
    contenido: z.string().min(20, 'El contenido debe tener al menos 20 caracteres'),
    categoria: z.enum(categoriasValidas, {
      message: 'Categoría no válida. Opciones: nacionales, internacionales, deportes, tecnologia'
    }),
    imagenUrl: z.string().url('La URL de la imagen no es válida').optional()
  })
});

export const EsquemaActualizarNoticia = z.object({
  body: z.object({
    titulo: z.string().min(5).max(150).optional(),
    resumen: z.string().min(10).max(300).optional(),
    contenido: z.string().min(20).optional(),
    categoria: z.enum(categoriasValidas, {
      message: 'Categoría no válida. Opciones: nacionales, internacionales, deportes, tecnologia'
    }).optional(),
    imagenUrl: z.string().url().optional()
  }).refine(datos => Object.keys(datos).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar'
  })
});

export type EntradaCrearNoticia = z.infer<typeof EsquemaCrearNoticia>['body'];
export type EntradaActualizarNoticia = z.infer<typeof EsquemaActualizarNoticia>['body'];