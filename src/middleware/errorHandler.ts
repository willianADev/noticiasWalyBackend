import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${err.message}`);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.issues.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }

  if (err.message === 'Noticia no encontrada') {
    return res.status(404).json({
      success: false,
      error: err.message
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};