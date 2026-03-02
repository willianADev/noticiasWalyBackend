import { Request as Peticion, Response as Respuesta, NextFunction as SiguienteFuncion } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export const validarPeticion = (esquema: ZodSchema) => 
  async (pet: Peticion, res: Respuesta, sig: SiguienteFuncion) => {
    try {
      const validado = await esquema.parseAsync({
        body: pet.body,
        query: pet.query,
        params: pet.params,
      });
      
      pet.body = (validado as any).body;
      
      return sig();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          exito: false,
          errores: error.issues.map((e: ZodIssue) => ({ 
            campo: e.path[1] || e.path[0] || 'desconocido', 
            mensaje: e.message 
          }))
        });
      }
      return res.status(500).json({ exito: false, mensaje: "Error interno de validación" });
    }
  };