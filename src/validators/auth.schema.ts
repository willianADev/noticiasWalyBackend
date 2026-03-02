import { z } from 'zod';

export const EsquemaIniciarSesion = z.object({
    body: z.object({
        usuario: z.string().min(1, "El usuario es obligatorio"),
        contrasena: z.string().min(1, "La contraseña es obligatoria"),
    }),
});

export type EntradaIniciarSesion = z.infer<typeof EsquemaIniciarSesion>['body'];