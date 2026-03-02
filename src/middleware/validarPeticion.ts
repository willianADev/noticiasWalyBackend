import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validarPeticion = (esquema: z.ZodTypeAny) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const resultado: any = await esquema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = resultado.body ?? req.body;
      req.query = resultado.query ?? req.query;
      req.params = resultado.params ?? req.params;

      next();
    } catch (error) {
      next(error);
    }
  };
};