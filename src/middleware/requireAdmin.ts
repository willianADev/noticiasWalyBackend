import { Request as Peticion, Response as Respuesta, NextFunction as SiguienteFuncion } from 'express';
import jwt from 'jsonwebtoken';
import { entorno } from '../config/env';

declare global {
  namespace Express {
    interface Request {
      usuarioAutenticado?: any;
    }
  }
}

export const requerirAdmin = (pet: Peticion, res: Respuesta, sig: SiguienteFuncion) => {
  const cabeceraAuth = pet.headers.authorization;

  if (!cabeceraAuth || !cabeceraAuth.startsWith('Bearer ')) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Acceso denegado: Token no proporcionado'
    });
  }

  const token = cabeceraAuth.split(' ')[1];

  try {
    const cargaUtil = jwt.verify(token, entorno.JWT_SECRETO) as any;
    
    if (cargaUtil.rol !== 'administrador') {
      return res.status(403).json({
        exito: false,
        mensaje: 'Acceso denegado: No tienes privilegios de administrador'
      });
    }

    pet.usuarioAutenticado = cargaUtil;
    return sig();
  } catch (error) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token inválido o expirado'
    });
  }
};