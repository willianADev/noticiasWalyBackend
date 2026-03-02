import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class ErrorAplicacion extends Error {
  constructor(public mensaje: string, public codigoEstado: number) {
    super(mensaje);
    Object.setPrototypeOf(this, ErrorAplicacion.prototype);
  }
}

export const manejadorErrores = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ErrorAplicacion) {
    return res.status(error.codigoEstado).json({
      estado: 'error',
      mensaje: error.mensaje
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      estado: 'error',
      mensaje: 'Fallo la validación de los datos enviados',
      detalles: error.issues.map(e => ({
        campo: e.path.join('.'),
        mensaje: e.message
      }))
    });
  }

  console.error(`[ERROR NO CONTROLADO]: ${error.stack}`);
  
  return res.status(500).json({
    estado: 'error',
    mensaje: 'Ha ocurrido un error interno en el servidor'
  });
};