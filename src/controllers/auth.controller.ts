import { Request as Peticion, Response as Respuesta } from 'express';
import jwt from 'jsonwebtoken';
import { entorno } from '../config/env';
import { EntradaIniciarSesion } from '../validators/auth.schema';

export const iniciarSesion = async (pet: Peticion<{}, {}, EntradaIniciarSesion>, res: Respuesta) => {
    const { usuario, contrasena } = pet.body;

    if (usuario !== entorno.ADMIN_USUARIO || contrasena !== entorno.ADMIN_CONTRASENA) {
        return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
        });
    }

    const token = jwt.sign(
        { rol: 'administrador', usuario }, 
        entorno.JWT_SECRETO, 
        { expiresIn: '12h' }
    );

    return res.status(200).json({
        exito: true,
        mensaje: 'Autenticación exitosa',
        datos: { token }
    });
};