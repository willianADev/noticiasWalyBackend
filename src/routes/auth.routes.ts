import { Router } from 'express';
import { iniciarSesion } from '../controllers/auth.controller';
import { validarPeticion } from '../middleware/validarPeticion';
import { EsquemaIniciarSesion } from '../validators/auth.schema';

const enrutador = Router();

// Ruta: POST /api/auth/login
enrutador.post('/login', validarPeticion(EsquemaIniciarSesion), iniciarSesion);

export default enrutador;