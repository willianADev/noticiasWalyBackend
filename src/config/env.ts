import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const esquemaEntorno = z.object({
  PUERTO: z.string().default('3000'),
  ADMIN_USUARIO: z.string().min(3, "Usuario administrador requerido"),
  ADMIN_CONTRASENA: z.string().min(6, "Contraseña administador requerida"),
  JWT_SECRETO: z.string().min(10, "Secreto JWT demasiado corto"),
});

const entornoValidado = esquemaEntorno.safeParse(process.env);

if (!entornoValidado.success) {
  console.error('Error en las variables de entorno:', entornoValidado.error.format());
  process.exit(1); 
}

export const entorno = entornoValidado.data;